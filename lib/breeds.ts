
export interface Breed {
  code: string;
  name: string;
  personality: string;
  health_issue: string;
  origin: string;
}

export const BREEDS: Breed[] = [
  { code: 'KSH', name: '코리안 숏헤어', origin: '한국', personality: '활발하고 독립적이며, 사냥 본능이 뛰어나요. 개체마다 성격 차이가 큽니다.', health_issue: '자연 발생종으로 유전병이 적어 건강하지만, 비만에 주의해야 합니다.' },
  { code: 'RUS', name: '러시안 블루', origin: '러시아', personality: '조용하고 수줍음이 많지만, 주인에게는 애교가 넘치는 개냥이입니다.', health_issue: '식욕이 왕성해 비만이 되기 쉽고, 요로결석에 주의해야 합니다.' },
  { code: 'PER', name: '페르시안', origin: '이란', personality: '매우 얌전하고 느긋하며, 높은 곳보다는 바닥을 좋아합니다.', health_issue: '납작한 코로 인한 호흡기 질환과 다낭성 신장 질환(PKD) 위험이 있습니다.' },
  { code: 'SIA', name: '샴', origin: '태국', personality: '수다쟁이이며 사람을 매우 좋아하고 질투심이 강합니다.', health_issue: '진행성 망막 위축증과 같은 안과 질환에 유의해야 합니다.' },
  { code: 'SFO', name: '스코티시 폴드', origin: '스코틀랜드', personality: '상냥하고 적응력이 뛰어나며, 사람 곁에 있는 것을 좋아합니다.', health_issue: '접힌 귀 유전자로 인한 골연골 이형성증(관절 질환) 관리가 필수입니다.' },
  { code: 'MCO', name: '메인쿤', origin: '미국', personality: '거대하지만 신사적이고 온순하며, 물을 좋아하는 경우가 많습니다.', health_issue: '비대성 심근병증(HCM)과 고관절 이형성증에 주의해야 합니다.' },
  { code: 'BEN', name: '뱅갈', origin: '미국', personality: '야생의 본능이 남아있어 활동량이 엄청나고 호기심이 많습니다.', health_issue: '진행성 망막 위축증과 비대성 심근병증(HCM) 위험이 있습니다.' },
  { code: 'RAG', name: '랙돌', origin: '미국', personality: '안아주면 인형처럼 축 늘어지는 순둥이로, 공격성이 거의 없습니다.', health_issue: '비대성 심근병증(HCM)과 방광 결석에 유의하세요.' },
  { code: 'NOR', name: '노르웨이 숲', origin: '노르웨이', personality: '똑똑하고 독립적이며, 높은 곳을 좋아하는 등산가입니다.', health_issue: '당원병(GSD IV) 유전 질환 확인이 필요하며 심장병에 주의하세요.' },
  { code: 'MUN', name: '먼치킨', origin: '미국', personality: '다리는 짧지만 운동신경이 좋고, 긍정적이며 명랑합니다.', health_issue: '척추 전만증과 흉곽 기형 등 척추 관련 질환에 주의해야 합니다.' },
  { code: 'ABY', name: '아비시니안', origin: '에티오피아', personality: '지능이 높고 민첩하며, 잠시도 가만히 있지 않는 활동가입니다.', health_issue: '신장 아밀로이드증과 치주 질환에 취약할 수 있습니다.' },
  { code: 'SPH', name: '스핑크스', origin: '캐나다', personality: '털이 없어 추위를 많이 타며, 사람의 체온을 찾아 파고드는 애교쟁이입니다.', health_issue: '피부병에 취약하며, 체온 유지를 위해 고칼로리 섭취가 필요합니다.' },
  { code: 'BRI', name: '브리티시 숏헤어', origin: '영국', personality: '인내심이 강하고 조용하며, 배려심이 깊은 신사입니다.', health_issue: '비대성 심근병증(HCM)과 혈우병 B에 주의해야 합니다.' },
  { code: 'TUR', name: '터키시 앙고라', origin: '튀르키예', personality: '영리하고 호기심이 많으며, 구속받는 것을 싫어합니다.', health_issue: '오드아이의 경우 난청이 있을 수 있으며, 운동 실조증에 주의하세요.' },
  { code: 'AME', name: '아메리칸 숏헤어', origin: '미국', personality: '낙천적이고 쾌활하며, 다른 동물들과도 잘 지냅니다.', health_issue: '비대성 심근병증(HCM)에 주의해야 합니다.' },
  { code: 'EXO', name: '엑조틱', origin: '미국', personality: '페르시안처럼 조용하지만 조금 더 활발한 편입니다.', health_issue: '단두종 호흡기 폐쇄 증후군과 눈물관 막힘에 유의하세요.' },
  { code: 'SIB', name: '시베리안', origin: '러시아', personality: '강인한 체력을 가졌지만 마음은 따뜻하고 애정이 넘칩니다.', health_issue: '비교적 건강하지만 심장 질환 검진은 권장됩니다.' },
  { code: 'BOM', name: '봄베이', origin: '미국', personality: '작은 흑표범 같지만, 사람 무릎을 떠나지 않는 개냥이입니다.', health_issue: '두개안면 기형 등 유전 질환에 주의가 필요합니다.' },
  { code: 'DEV', name: '데본 렉스', origin: '영국', personality: '요정 같은 외모에 장난기가 가득하며, 어깨에 올라타는 걸 좋아합니다.', health_issue: '슬개골 탈구와 근육병증에 유의해야 합니다.' },
  { code: 'MIX', name: '믹스/기타', origin: '알수없음', personality: '세상에 단 하나뿐인 특별한 매력을 가지고 있습니다.', health_issue: '유전적 다양성으로 인해 튼튼한 편이지만, 정기 검진은 필수입니다.' },
];

export const getBreedInfo = (code?: string) => BREEDS.find(b => b.code === code);
