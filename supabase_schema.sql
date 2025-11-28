-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Public profile info, linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  subscription_tier text default 'BETA',
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can view own profile') then
    create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
  end if;
  -- Admin Policy
  -- Fix: Use a security definer function to avoid infinite recursion when checking admin status
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Admins can view all profiles') then
    create policy "Admins can view all profiles" on profiles for select using (
      (select is_admin from profiles where id = auth.uid()) = true
    );
  end if;
end $$;

-- Helper function to check admin status without triggering RLS recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Update the policy to use the function
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using (
  public.is_admin()
);

-- 2. CATS
create table if not exists public.cats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  birth_date date,
  breed_code text,
  gender text check (gender in ('M', 'F')),
  is_neutered boolean default false,
  weight_kg numeric,
  bcs numeric, -- Body Condition Score (1-9)
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Cats
alter table public.cats enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'cats' and policyname = 'Users can view own cats') then
    create policy "Users can view own cats" on cats for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cats' and policyname = 'Users can insert own cats') then
    create policy "Users can insert own cats" on cats for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'cats' and policyname = 'Users can update own cats') then
    create policy "Users can update own cats" on cats for update using (auth.uid() = user_id);
  id uuid default uuid_generate_v4() primary key,
  cat_id uuid references public.cats(id) on delete cascade not null,
  check_type text not null, -- URINE, DENTAL
  result text not null, -- NORMAL, WARNING, DANGER
  check_date date default CURRENT_DATE,
  note text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Home Checks
alter table public.home_checks enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'home_checks' and policyname = 'Users can manage home checks for their cats') then
    create policy "Users can manage home checks for their cats" on home_checks for all 
    using (cat_id in (select id from cats where user_id = auth.uid()))
    with check (cat_id in (select id from cats where user_id = auth.uid()));
  end if;
end $$;

-- 6. APPOINTMENTS (New)
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  cat_id uuid references public.cats(id) on delete cascade not null,
  title text not null,
  date date not null,
  time text not null,
  hospital_name text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Appointments
alter table public.appointments enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'appointments' and policyname = 'Users can manage appointments for their cats') then
    create policy "Users can manage appointments for their cats" on appointments for all 
    using (cat_id in (select id from cats where user_id = auth.uid()))
    with check (cat_id in (select id from cats where user_id = auth.uid()));
  end if;
end $$;

-- 7. MEDICATIONS (New)
create table if not exists public.medications (
  id uuid default uuid_generate_v4() primary key,
  cat_id uuid references public.cats(id) on delete cascade not null,
  name text not null,
  dosage text not null,
  frequency text not null,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Medications
alter table public.medications enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'medications' and policyname = 'Users can manage medications for their cats') then
    create policy "Users can manage medications for their cats" on medications for all 
    using (cat_id in (select id from cats where user_id = auth.uid()))
    with check (cat_id in (select id from cats where user_id = auth.uid()));
  end if;
end $$;

-- 8. HEALTH TIPS (Content)
create table if not exists public.health_tips (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  thumbnail_url text,
  video_url text,
  content text,
  category text, -- HEALTH, BEHAVIOR, FOOD
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Health Tips
alter table public.health_tips enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'health_tips' and policyname = 'Anyone can view published tips') then
    create policy "Anyone can view published tips" on health_tips for select using (is_published = true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'health_tips' and policyname = 'Admins can manage tips') then
    create policy "Admins can manage tips" on health_tips for all 
    using (auth.uid() in (select id from profiles where is_admin = true))
    with check (auth.uid() in (select id from profiles where is_admin = true));
  end if;
end $$;

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. SEED DATA (Health Tips)
insert into public.health_tips (title, category, content, thumbnail_url, is_published)
values 
(
  '고양이 양치질, 전쟁 없이 성공하는 3단계 비법',
  'HEALTH',
  '# 양치질, 포기하지 마세요!

고양이의 치아 건강은 신장 및 심장 건강과 직결됩니다. 하지만 칫솔만 보면 도망가는 냥이들 때문에 고민이시죠?

### 1단계: 맛과 익숙해지기
처음엔 칫솔을 사용하지 마세요. 손가락에 치약을 묻혀 맛을 보게 하고, 입 주변을 만지는 것에 익숙해지게 합니다.

### 2단계: 가즈(Gauze) 활용
거즈를 손가락에 감고 치약을 묻혀 부드럽게 문질러주세요. 칫솔보다 거부감이 덜합니다.

### 3단계: 송곳니부터 공략
앞니는 예민하므로 옆쪽 송곳니와 어금니부터 닦아주세요.',
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop',
  true
),
(
  '음수량 늘리기 프로젝트: 감자왕이 되는 길',
  'HEALTH',
  '# 물 마시는 게 왜 중요할까요?

고양이는 본래 사막 태생이라 갈증을 잘 느끼지 못합니다. 하지만 음수량 부족은 **만성 신부전**과 **방광염**의 주원인이 됩니다.

### 음수량 늘리는 꿀팁
1. **물그릇 위치**: 밥그릇과 떨어진 곳에, 화장실과 먼 곳에 두세요.
2. **다양한 그릇**: 유리, 도자기, 스테인리스 등 고양이마다 취향이 다릅니다.
3. **흐르는 물**: 정수기를 사용하면 호기심을 자극해 더 많이 마십니다.
4. **습식 급여**: 하루 한 끼는 습식 캔에 물을 조금 타서 주세요.',
  'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop',
  true
),
(
  '사냥 놀이의 정석: 하루 15분으로 문제행동 해결',
  'BEHAVIOR',
  '# 사냥 놀이는 선택이 아닌 필수!

고양이의 에너지를 해소해주지 않으면 밤마다 우다다를 하거나, 집사의 손발을 깨무는 문제 행동으로 이어질 수 있습니다.

### 올바른 사냥 놀이 루틴 (Hunt-Catch-Kill-Eat)
1. **탐색**: 장난감을 숨겼다 보였다 하며 호기심 자극
2. **추격**: 격렬하게 움직여 뛰게 만들기
3. **포획**: 잡을 수 있는 기회를 주어 성취감 부여
4. **식사**: 놀이 직후 간식을 주어 사냥 성공의 보상 제공',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop',
  true
),
(
  '뚱냥이 탈출 작전: 건강한 다이어트 가이드',
  'FOOD',
  '# 귀여운 뱃살? 건강의 적신호!

비만은 관절염, 당뇨 등 만병의 근원입니다. 

### 다이어트 원칙
1. **목표 체중 설정**: 현재 체중의 1~2% 감량을 주간 목표로 잡으세요.
2. **제한 급식**: 자율 급식을 중단하고 하루 3~4회 나누어 주세요.
3. **운동 병행**: 먹이 퍼즐을 사용해 밥 먹는 시간을 활동 시간으로 바꾸세요.',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop',
  true
),
(
  '사람 음식, 고양이에게 줘도 될까요?',
  'FOOD',
  '# 절대 주면 안 되는 음식

사람에게는 보약이어도 고양이에게는 독이 될 수 있습니다.

- **파, 양파, 마늘**: 적혈구를 파괴하여 빈혈 유발
- **초콜릿, 커피**: 카페인은 치명적인 중독 증상 유발
- **포도, 건포도**: 급성 신부전의 원인

### 줘도 되는 음식 (소량만!)
- 삶은 닭가슴살 (양념 X)
- 삶은 호박, 고구마
- 익힌 연어',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
  true
),
(
  '갑자기 화장실 실수를 한다면?',
  'BEHAVIOR',
  '# 배변 실수, 훈련 문제가 아닐 수 있습니다.

잘 가리던 고양이가 이불이나 바닥에 실수를 한다면, 혼내기 전에 원인을 파악해야 합니다.

### 주요 원인 체크리스트
1. **질병**: 방광염이나 결석으로 인한 통증 때문에 화장실을 기피할 수 있습니다. 가장 먼저 병원에 가보세요.
2. **청결**: 모래가 너무 더럽지 않나요? 최소 하루 2번 청소해주세요.
3. **위치**: 밥 먹는 곳 옆이나 시끄러운 세탁실 옆은 싫어합니다.
4. **모래**: 벤토나이트, 두부모래 등 선호하는 모래 재질이 바뀔 수 있습니다.',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&auto=format&fit=crop',
  true
),
(
  '노령묘 건강 관리: 7세부터 시작하세요',
  'HEALTH',
  '# 우리 고양이가 벌써 노령묘?

고양이는 7세부터 노화가 시작됩니다. 정기적인 검진과 세심한 관리가 필요합니다.

### 주요 체크 포인트
1. **정기 검진**: 6개월마다 병원 방문을 권장합니다.
2. **체중 변화**: 급격한 체중 감소는 신장 질환이나 당뇨의 신호일 수 있습니다.
3. **음수량**: 신장 건강을 위해 물을 많이 마시게 해주세요.
4. **관절 관리**: 높은 곳을 오르내리기 힘들다면 계단을 설치해주세요.',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop',
  true
),
(
  '아기 고양이 입양 첫날 가이드',
  'BEHAVIOR',
  '# 낯선 환경에 적응하는 시간

아기 고양이가 집에 처음 온 날, 무리하게 만지려 하지 마세요.

### 적응 3단계
1. **안전한 공간**: 작은 방이나 격리장을 마련해 안정감을 줍니다.
2. **스스로 탐색**: 억지로 꺼내지 말고 스스로 나올 때까지 기다려주세요.
3. **화장실 교육**: 식사 후나 자고 일어난 후 화장실에 데려가 모래를 파는 시늉을 보여주세요.',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop',
  true
),
(
  '고양이 응급 상황: 병원에 바로 가야 할 때',
  'HEALTH',
  '# 골든타임을 놓치지 마세요!

고양이는 아픔을 숨기는 본능이 있어 증상이 보이면 이미 심각한 상태일 수 있습니다.

### 즉시 병원에 가야 하는 증상
1. **개구호흡**: 입을 벌리고 숨을 쉰다면 매우 위급한 상황입니다.
2. **배뇨 곤란**: 화장실을 들락거리며 소변을 못 본다면 요도 폐쇄일 수 있습니다 (특히 수컷).
3. **하반신 마비**: 뒷다리를 못 쓴다면 혈전증일 가능성이 높습니다.
4. **지속적인 구토**: 하루 3회 이상 구토하거나 무기력증이 동반될 때.',
  'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800&auto=format&fit=crop',
  true
),
(
  '고양이에게 위험한 식물 리스트',
  'FOOD',
  '# 예쁜 꽃이 고양이에게는 독?

집안에 두는 식물 중 고양이에게 치명적인 것들이 있습니다.

### 절대 피해야 할 식물
1. **백합과 식물**: 꽃가루만 묻어도 급성 신부전을 일으켜 사망에 이를 수 있습니다.
2. **튤립, 히아신스**: 구근에 독성이 강해 심각한 위장 장애를 유발합니다.
3. **진달래, 철쭉**: 구토, 설사, 심장 이상을 일으킬 수 있습니다.

### 안전한 식물 (캣그라스 제외)
- 테이블 야자, 보스턴 고사리, 스파이더 플랜트',
  'https://images.unsplash.com/photo-1557431177-36141475c676?w=800&auto=format&fit=crop',
  true
);

-- 10. BACKFILL PROFILES (Fix for existing users)
insert into public.profiles (id, email)
select id, email from auth.users
where id not in (select id from public.profiles);
