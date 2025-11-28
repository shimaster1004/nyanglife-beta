
import { create } from 'zustand';
import { Cat, HealthLog, Profile, Todo, HomeCheck, HealthTip, Appointment, Medication } from './types';
import { generateId } from './lib/utils';
import { supabase } from './lib/supabase';

// Initial Data for DB Seeding (Will be inserted into DB if empty)
const SEED_TIPS: Omit<HealthTip, 'id' | 'created_at'>[] = [
  {
    title: '고양이 양치질, 전쟁 없이 성공하는 3단계 비법',
    category: 'HEALTH',
    content: `
# 양치질, 포기하지 마세요!

고양이의 치아 건강은 신장 및 심장 건강과 직결됩니다. 하지만 칫솔만 보면 도망가는 냥이들 때문에 고민이시죠?

### 1단계: 맛과 익숙해지기
처음엔 칫솔을 사용하지 마세요. 손가락에 치약을 묻혀 맛을 보게 하고, 입 주변을 만지는 것에 익숙해지게 합니다.

### 2단계: 가즈(Gauze) 활용
거즈를 손가락에 감고 치약을 묻혀 부드럽게 문질러주세요. 칫솔보다 거부감이 덜합니다.

### 3단계: 송곳니부터 공략
앞니는 예민하므로 옆쪽 송곳니와 어금니부터 닦아주세요.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '음수량 늘리기 프로젝트: 감자왕이 되는 길',
    category: 'HEALTH',
    content: `
# 물 마시는 게 왜 중요할까요?

고양이는 본래 사막 태생이라 갈증을 잘 느끼지 못합니다. 하지만 음수량 부족은 **만성 신부전**과 **방광염**의 주원인이 됩니다.

### 음수량 늘리는 꿀팁
1. **물그릇 위치**: 밥그릇과 떨어진 곳에, 화장실과 먼 곳에 두세요.
2. **다양한 그릇**: 유리, 도자기, 스테인리스 등 고양이마다 취향이 다릅니다.
3. **흐르는 물**: 정수기를 사용하면 호기심을 자극해 더 많이 마십니다.
4. **습식 급여**: 하루 한 끼는 습식 캔에 물을 조금 타서 주세요.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '사냥 놀이의 정석: 하루 15분으로 문제행동 해결',
    category: 'BEHAVIOR',
    content: `
# 사냥 놀이는 선택이 아닌 필수!

고양이의 에너지를 해소해주지 않으면 밤마다 우다다를 하거나, 집사의 손발을 깨무는 문제 행동으로 이어질 수 있습니다.

### 올바른 사냥 놀이 루틴 (Hunt-Catch-Kill-Eat)
1. **탐색**: 장난감을 숨겼다 보였다 하며 호기심 자극
2. **추격**: 격렬하게 움직여 뛰게 만들기
3. **포획**: 잡을 수 있는 기회를 주어 성취감 부여
4. **식사**: 놀이 직후 간식을 주어 사냥 성공의 보상 제공
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '뚱냥이 탈출 작전: 건강한 다이어트 가이드',
    category: 'FOOD',
    content: `
# 귀여운 뱃살? 건강의 적신호!

비만은 관절염, 당뇨 등 만병의 근원입니다. 

### 다이어트 원칙
1. **목표 체중 설정**: 현재 체중의 1~2% 감량을 주간 목표로 잡으세요.
2. **제한 급식**: 자율 급식을 중단하고 하루 3~4회 나누어 주세요.
3. **운동 병행**: 먹이 퍼즐을 사용해 밥 먹는 시간을 활동 시간으로 바꾸세요.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '사람 음식, 고양이에게 줘도 될까요?',
    category: 'FOOD',
    content: `
# 절대 주면 안 되는 음식

사람에게는 보약이어도 고양이에게는 독이 될 수 있습니다.

- **파, 양파, 마늘**: 적혈구를 파괴하여 빈혈 유발
- **초콜릿, 커피**: 카페인은 치명적인 중독 증상 유발
- **포도, 건포도**: 급성 신부전의 원인

### 줘도 되는 음식 (소량만!)
- 삶은 닭가슴살 (양념 X)
- 삶은 호박, 고구마
- 익힌 연어
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '갑자기 화장실 실수를 한다면?',
    category: 'BEHAVIOR',
    content: `
# 배변 실수, 훈련 문제가 아닐 수 있습니다.

잘 가리던 고양이가 이불이나 바닥에 실수를 한다면, 혼내기 전에 원인을 파악해야 합니다.

### 주요 원인 체크리스트
1. **질병**: 방광염이나 결석으로 인한 통증 때문에 화장실을 기피할 수 있습니다. 가장 먼저 병원에 가보세요.
2. **청결**: 모래가 너무 더럽지 않나요? 최소 하루 2번 청소해주세요.
3. **위치**: 밥 먹는 곳 옆이나 시끄러운 세탁실 옆은 싫어합니다.
4. **모래**: 벤토나이트, 두부모래 등 선호하는 모래 재질이 바뀔 수 있습니다.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '노령묘 건강 관리: 7세부터 시작하세요',
    category: 'HEALTH',
    content: `
# 우리 고양이가 벌써 노령묘?

고양이는 7세부터 노화가 시작됩니다. 정기적인 검진과 세심한 관리가 필요합니다.

### 주요 체크 포인트
1. **정기 검진**: 6개월마다 병원 방문을 권장합니다.
2. **체중 변화**: 급격한 체중 감소는 신장 질환이나 당뇨의 신호일 수 있습니다.
3. **음수량**: 신장 건강을 위해 물을 많이 마시게 해주세요.
4. **관절 관리**: 높은 곳을 오르내리기 힘들다면 계단을 설치해주세요.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '아기 고양이 입양 첫날 가이드',
    category: 'BEHAVIOR',
    content: `
# 낯선 환경에 적응하는 시간

아기 고양이가 집에 처음 온 날, 무리하게 만지려 하지 마세요.

### 적응 3단계
1. **안전한 공간**: 작은 방이나 격리장을 마련해 안정감을 줍니다.
2. **스스로 탐색**: 억지로 꺼내지 말고 스스로 나올 때까지 기다려주세요.
3. **화장실 교육**: 식사 후나 자고 일어난 후 화장실에 데려가 모래를 파는 시늉을 보여주세요.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '고양이 응급 상황: 병원에 바로 가야 할 때',
    category: 'HEALTH',
    content: `
# 골든타임을 놓치지 마세요!

고양이는 아픔을 숨기는 본능이 있어 증상이 보이면 이미 심각한 상태일 수 있습니다.

### 즉시 병원에 가야 하는 증상
1. **개구호흡**: 입을 벌리고 숨을 쉰다면 매우 위급한 상황입니다.
2. **배뇨 곤란**: 화장실을 들락거리며 소변을 못 본다면 요도 폐쇄일 수 있습니다 (특히 수컷).
3. **하반신 마비**: 뒷다리를 못 쓴다면 혈전증일 가능성이 높습니다.
4. **지속적인 구토**: 하루 3회 이상 구토하거나 무기력증이 동반될 때.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800&auto=format&fit=crop',
    is_published: true,
  },
  {
    title: '고양이에게 위험한 식물 리스트',
    category: 'FOOD',
    content: `
# 예쁜 꽃이 고양이에게는 독?

집안에 두는 식물 중 고양이에게 치명적인 것들이 있습니다.

### 절대 피해야 할 식물
1. **백합과 식물**: 꽃가루만 묻어도 급성 신부전을 일으켜 사망에 이를 수 있습니다.
2. **튤립, 히아신스**: 구근에 독성이 강해 심각한 위장 장애를 유발합니다.
3. **진달래, 철쭉**: 구토, 설사, 심장 이상을 일으킬 수 있습니다.

### 안전한 식물 (캣그라스 제외)
- 테이블 야자, 보스턴 고사리, 스파이더 플랜트
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1557431177-36141475c676?w=800&auto=format&fit=crop',
    is_published: true,
  }
];

interface AppState {
  user: Profile | null;
  cats: Cat[];
  currentCatId: string | null;
  logs: HealthLog[];
  todos: Todo[];
  homeChecks: HomeCheck[];
  healthTips: HealthTip[];
  appointments: Appointment[];
  medications: Medication[];
  isLoading: boolean;

  // Actions
  login: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loadInitialData: () => Promise<void>;

  addCat: (cat: Omit<Cat, 'id' | 'user_id'>) => Promise<boolean>;
  updateCat: (id: string, data: Partial<Cat>) => Promise<boolean>;
  deleteCat: (id: string) => Promise<void>;
  setCurrentCat: (id: string) => void;

  addTodo: (content: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;

  addLog: (log: Omit<HealthLog, 'id' | 'created_at' | 'cat_id'>) => Promise<void>;
  updateLog: (id: string, log: Partial<Omit<HealthLog, 'id' | 'created_at' | 'cat_id'>>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;

  // Home Check Actions
  addHomeCheck: (check: Omit<HomeCheck, 'id' | 'cat_id'>) => Promise<void>;
  updateHomeCheck: (id: string, data: Partial<HomeCheck>) => Promise<void>;
  deleteHomeCheck: (id: string) => Promise<void>;

  // Admin CMS Actions
  addHealthTip: (tip: Omit<HealthTip, 'id' | 'created_at'>) => Promise<void>;
  updateHealthTip: (id: string, tip: Partial<HealthTip>) => Promise<void>;
  deleteHealthTip: (id: string) => Promise<void>;

  // Appointment Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'cat_id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  // Medication Actions
  addMedication: (medication: Omit<Medication, 'id' | 'created_at' | 'cat_id'>) => Promise<void>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;

  // Demo Action
  loginAsDemo: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  cats: [],
  currentCatId: null,
  logs: [],
  todos: [],
  homeChecks: [],
  healthTips: [],
  appointments: [],
  medications: [],
  isLoading: false,

  loadInitialData: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Check if we are in demo mode (local storage or just skip)
        // For now, just reset
        set({ user: null, cats: [], logs: [], todos: [], homeChecks: [], appointments: [], medications: [], isLoading: false });
        return;
      }

      // 1. Set User Profile
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('is_admin, subscription_tier')
        .eq('id', user.id)
        .single();

      const profile: Profile = {
        id: user.id,
        email: user.email || '',
        subscription_tier: dbProfile?.subscription_tier || 'BETA',
        is_admin: dbProfile?.is_admin || false
      };
      set({ user: profile });

      // 2. Load Cats
      // 2. Load Cats
      console.log("Fetching cats for user:", user.id);
      const { data: cats, error: catsError } = await supabase
        .from('cats')
        .select('*')
        .eq('user_id', user.id) // Explicitly filter by user_id
        .order('created_at', { ascending: true });

      console.log("Cats fetch result:", { cats, error: catsError });

      if (catsError) {
        console.error("Error fetching cats:", catsError);
        // Don't throw, just let it be empty so user can retry or see setup
      }

      if (cats && cats.length > 0) {
        set({ cats, currentCatId: cats[0].id });
      } else {
        set({ cats: [], currentCatId: null });
      }

      // 3. Load Health Tips (Auto-Seed if empty)
      let { data: tips } = await supabase.from('health_tips').select('*').order('created_at', { ascending: false });

      // Auto-Seeding Logic
      // Auto-Seeding & Sync Logic
      if (!tips || tips.length === 0) {
        console.log('Seeding initial health tips...');
        const { error } = await supabase.from('health_tips').insert(SEED_TIPS);
        if (!error) {
          const { data: newTips } = await supabase.from('health_tips').select('*').order('created_at', { ascending: false });
          tips = newTips;
        }
      } else {
        // Smart Sync: Check if there are any NEW tips in SEED_TIPS that are not in DB
        const existingTitles = new Set(tips.map(t => t.title));
        const newTipsToAdd = SEED_TIPS.filter(t => !existingTitles.has(t.title));

        if (newTipsToAdd.length > 0) {
          console.log(`Found ${newTipsToAdd.length} new tips to sync. Adding them...`);
          const { error } = await supabase.from('health_tips').insert(newTipsToAdd);
          if (!error) {
            // Re-fetch to include the new tips
            const { data: updatedTips } = await supabase.from('health_tips').select('*').order('created_at', { ascending: false });
            tips = updatedTips;
          } else {
            console.error('Failed to sync new tips:', error);
          }
        }
      }
      set({ healthTips: tips || [] });

      // 4. Load User Specific Data if cats exist
      if (cats && cats.length > 0) {
        const catIds = cats.map(c => c.id);

        const { data: logs } = await supabase.from('health_logs').select('*').in('cat_id', catIds);
        set({ logs: logs || [] });

        const { data: todos } = await supabase.from('todos').select('*').in('cat_id', catIds).order('created_at', { ascending: false });
        set({ todos: todos || [] });

        const { data: checks } = await supabase.from('home_checks').select('*').in('cat_id', catIds);
        set({ homeChecks: checks || [] });

        const { data: appointments } = await supabase.from('appointments').select('*').in('cat_id', catIds).order('date', { ascending: true });
        set({ appointments: appointments || [] });

        const { data: medications } = await supabase.from('medications').select('*').in('cat_id', catIds).order('start_date', { ascending: false });
        set({ medications: medications || [] });
      }

    } catch (error: any) {
      console.error("Error loading initial data:", error);
      alert(`데이터 로딩 중 오류가 발생했습니다: ${error.message || error}`);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async () => {
    set({ isLoading: true });
    // In a real app, this triggers OAuth. Here we just wait for the auth state change listener in App.tsx
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error(error);
  },

  loginWithEmail: async (email: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error(error);
      alert(`이메일 전송 실패: ${error.message}`);
    } else {
      alert(`인증 메일이 전송되었습니다!\n${email}을 확인해주세요.`);
    }
    set({ isLoading: false });
  },

  loginAsDemo: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const demoUser: Profile = {
      id: 'demo-user-id',
      email: 'demo@nyanglife.com',
      subscription_tier: 'BETA',
      is_admin: true
    };

    const demoCat: Cat = {
      id: 'demo-cat-id',
      user_id: 'demo-user-id',
      name: '치즈',
      birth_date: '2023-01-01', // Young adult
      gender: 'M',
      is_neutered: true,
      weight_kg: 4.5,
      image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop',
      created_at: new Date().toISOString()
    };

    const demoAppointment: Appointment = {
      id: 'demo-apt-1',
      cat_id: 'demo-cat-id',
      title: '정기 건강검진',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days later
      time: '14:00',
      hospital_name: '튼튼 동물병원',
      created_at: new Date().toISOString()
    };

    const demoMedication: Medication = {
      id: 'demo-med-1',
      cat_id: 'demo-cat-id',
      name: '심장사상충 예방약',
      dosage: '1알',
      frequency: '매월 1회',
      start_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    set({
      user: demoUser,
      cats: [demoCat],
      currentCatId: demoCat.id,
      healthTips: SEED_TIPS as HealthTip[], // Use seed tips for demo
      appointments: [demoAppointment],
      medications: [demoMedication],
      isLoading: false
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, cats: [], currentCatId: null });
  },

  addCat: async (catData) => {
    const state = get();
    // Demo mode check
    if (state.user?.id === 'demo-user-id') {
      const newCat: Cat = {
        ...catData,
        id: generateId(),
        user_id: 'demo-user-id',
        created_at: new Date().toISOString(),
        image_url: catData.image_url || null
      };
      set(state => ({
        cats: [...state.cats, newCat],
        currentCatId: newCat.id
      }));
      return true;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const { data, error } = await supabase.from('cats').insert([{
      ...catData,
      user_id: user.id
    }]).select();

    if (error) {
      console.error("Failed to add cat:", error);
      alert(`고양이 등록 실패: ${error.message}`);
      return false;
    }

    if (data) {
      set(state => ({
        cats: [...state.cats, data[0]],
        currentCatId: data[0].id
      }));
      return true;
    }
    return false;
  },

  updateCat: async (id, catData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        cats: state.cats.map(c => c.id === id ? { ...c, ...catData } : c)
      }));
      return true;
    }

    let { error } = await supabase.from('cats').update(catData).eq('id', id);

    // Fallback: If 'bcs' column is missing in DB, try updating without it
    if (error && error.message.includes("'bcs'")) {
      console.warn("BCS column missing in DB. Retrying without BCS...");
      const { bcs, ...safeData } = catData as any;
      const retry = await supabase.from('cats').update(safeData).eq('id', id);
      error = retry.error;
    }

    if (error) {
      console.error("Failed to update cat:", error);
      alert(`업데이트 실패: ${error.message}\n(Supabase SQL Editor에서 'ALTER TABLE cats ADD COLUMN bcs numeric;'를 실행해주세요)`);
      return false;
    }

    set(state => ({
      cats: state.cats.map(c => c.id === id ? { ...c, ...catData } : c)
    }));
    return true;
  },

  deleteCat: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => {
        const newCats = state.cats.filter(c => c.id !== id);
        return {
          cats: newCats,
          currentCatId: newCats.length > 0 ? newCats[0].id : null
        };
      });
      return;
    }

    const { error } = await supabase.from('cats').delete().eq('id', id);
    if (!error) {
      set(state => {
        const newCats = state.cats.filter(c => c.id !== id);
        return {
          cats: newCats,
          currentCatId: newCats.length > 0 ? newCats[0].id : null
        };
      });
    }
  },

  setCurrentCat: (id) => set({ currentCatId: id }),

  addTodo: async (content) => {
    const state = get();
    if (!state.currentCatId) return;

    if (state.user?.id === 'demo-user-id') {
      const newTodo: Todo = {
        id: generateId(),
        cat_id: state.currentCatId,
        content,
        is_completed: false,
        created_at: new Date().toISOString()
      };
      set(state => ({ todos: [newTodo, ...state.todos] }));
      return;
    }

    const { data, error } = await supabase.from('todos').insert([{
      cat_id: state.currentCatId,
      content,
      is_completed: false
    }]).select();

    if (!error && data) {
      set(state => ({ todos: [data[0], ...state.todos] }));
    }
  },

  toggleTodo: async (id) => {
    const state = get();
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;

    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t)
      }));
      return;
    }

    const { error } = await supabase.from('todos').update({ is_completed: !todo.is_completed }).eq('id', id);
    if (!error) {
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t)
      }));
    }
  },

  deleteTodo: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        todos: state.todos.filter(t => t.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) {
      set(state => ({
        todos: state.todos.filter(t => t.id !== id)
      }));
    }
  },

  addLog: async (logData) => {
    const state = get();
    if (!state.currentCatId) return;

    if (state.user?.id === 'demo-user-id') {
      const newLog: HealthLog = {
        ...logData,
        id: generateId(),
        cat_id: state.currentCatId,
        created_at: new Date().toISOString()
      };
      set(state => ({ logs: [...state.logs, newLog] }));

      // If weight log, update cat weight
      if (logData.log_type === 'WEIGHT' && typeof logData.value === 'number') {
        await get().updateCat(state.currentCatId, { weight_kg: logData.value as number });
      }
      return;
    }

    const { data, error } = await supabase.from('health_logs').insert([{
      ...logData,
      cat_id: state.currentCatId
    }]).select();

    if (!error && data) {
      set(state => ({ logs: [...state.logs, data[0]] }));

      // If weight log, update cat weight
      if (logData.log_type === 'WEIGHT' && typeof logData.value === 'number') {
        await get().updateCat(state.currentCatId, { weight_kg: logData.value as number });
      }
    }
  },

  updateLog: async (id, logData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        logs: state.logs.map(l => l.id === id ? { ...l, ...logData } : l)
      }));
      return;
    }

    const { error } = await supabase.from('health_logs').update(logData).eq('id', id);
    if (!error) {
      set(state => ({
        logs: state.logs.map(l => l.id === id ? { ...l, ...logData } : l)
      }));
    }
  },

  deleteLog: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        logs: state.logs.filter(l => l.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('health_logs').delete().eq('id', id);
    if (!error) {
      set(state => ({
        logs: state.logs.filter(l => l.id !== id)
      }));
    }
  },

  addHomeCheck: async (checkData) => {
    const state = get();
    if (!state.currentCatId) return;

    if (state.user?.id === 'demo-user-id') {
      const newCheck: HomeCheck = {
        ...checkData,
        id: generateId(),
        cat_id: state.currentCatId,
        created_at: new Date().toISOString()
      };
      set(state => ({ homeChecks: [newCheck, ...state.homeChecks] }));
      return;
    }

    const { data, error } = await supabase.from('home_checks').insert([{
      ...checkData,
      cat_id: state.currentCatId
    }]).select();

    if (!error && data) {
      set(state => ({ homeChecks: [data[0], ...state.homeChecks] }));
    }
  },

  updateHomeCheck: async (id, data) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        homeChecks: state.homeChecks.map(c => c.id === id ? { ...c, ...data } : c)
      }));
      return;
    }

    const { error } = await supabase.from('home_checks').update(data).eq('id', id);
    if (!error) {
      set(state => ({
        homeChecks: state.homeChecks.map(c => c.id === id ? { ...c, ...data } : c)
      }));
    }
  },

  deleteHomeCheck: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        homeChecks: state.homeChecks.filter(c => c.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('home_checks').delete().eq('id', id);
    if (!error) {
      set(state => ({
        homeChecks: state.homeChecks.filter(c => c.id !== id)
      }));
    }
  },

  addHealthTip: async (tipData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      const newTip: HealthTip = {
        ...tipData,
        id: generateId(),
        created_at: new Date().toISOString()
      };
      set(state => ({ healthTips: [newTip, ...state.healthTips] }));
      return;
    }

    const { data, error } = await supabase.from('health_tips').insert([tipData]).select();
    if (!error && data) {
      set(state => ({ healthTips: [data[0], ...state.healthTips] }));
    }
  },

  updateHealthTip: async (id, tipData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        healthTips: state.healthTips.map(t => t.id === id ? { ...t, ...tipData } : t)
      }));
      return;
    }

    const { error } = await supabase.from('health_tips').update(tipData).eq('id', id);
    if (!error) {
      set(state => ({
        healthTips: state.healthTips.map(t => t.id === id ? { ...t, ...tipData } : t)
      }));
    }
  },

  deleteHealthTip: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        healthTips: state.healthTips.filter(t => t.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('health_tips').delete().eq('id', id);
    if (!error) {
      set(state => ({
        healthTips: state.healthTips.filter(t => t.id !== id)
      }));
    }
  },

  addAppointment: async (aptData) => {
    const state = get();
    if (!state.currentCatId) return;

    if (state.user?.id === 'demo-user-id') {
      const newApt: Appointment = {
        ...aptData,
        id: generateId(),
        cat_id: state.currentCatId,
        created_at: new Date().toISOString()
      };
      set(state => ({ appointments: [...state.appointments, newApt].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }));
      return;
    }

    const { data, error } = await supabase.from('appointments').insert([{
      ...aptData,
      cat_id: state.currentCatId
    }]).select();

    if (!error && data) {
      set(state => ({ appointments: [...state.appointments, data[0]].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }));
    }
  },

  updateAppointment: async (id, aptData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        appointments: state.appointments
          .map(a => a.id === id ? { ...a, ...aptData } : a)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));
      return;
    }

    const { error } = await supabase.from('appointments').update(aptData).eq('id', id);
    if (!error) {
      set(state => ({
        appointments: state.appointments
          .map(a => a.id === id ? { ...a, ...aptData } : a)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));
    }
  },

  deleteAppointment: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        appointments: state.appointments.filter(a => a.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) {
      set(state => ({
        appointments: state.appointments.filter(a => a.id !== id)
      }));
    }
  },

  addMedication: async (medData) => {
    const state = get();
    if (!state.currentCatId) return;

    if (state.user?.id === 'demo-user-id') {
      const newMed: Medication = {
        ...medData,
        id: generateId(),
        cat_id: state.currentCatId,
        created_at: new Date().toISOString()
      };
      set(state => ({ medications: [newMed, ...state.medications] }));
      return;
    }

    const { data, error } = await supabase.from('medications').insert([{
      ...medData,
      cat_id: state.currentCatId
    }]).select();

    if (!error && data) {
      set(state => ({ medications: [data[0], ...state.medications] }));
    }
  },

  updateMedication: async (id, medData) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        medications: state.medications.map(m => m.id === id ? { ...m, ...medData } : m)
      }));
      return;
    }

    const { error } = await supabase.from('medications').update(medData).eq('id', id);
    if (!error) {
      set(state => ({
        medications: state.medications.map(m => m.id === id ? { ...m, ...medData } : m)
      }));
    }
  },

  deleteMedication: async (id) => {
    const state = get();
    if (state.user?.id === 'demo-user-id') {
      set(state => ({
        medications: state.medications.filter(m => m.id !== id)
      }));
      return;
    }

    const { error } = await supabase.from('medications').delete().eq('id', id);
    if (!error) {
      set(state => ({
        medications: state.medications.filter(m => m.id !== id)
      }));
    }
  },
}));
