# brainSprinter
 - 아이디어 웹 메모장
## motivation
 - 아이디어 정리를 보통 메모장에 하고있음
 - 근데 이게 많아지니까 폴더 분류를 하고있었는데 찾기가 귀찮아짐
 - 검색도 한두번이지 심지어 내용검색까지 하고있으려니 너무 빡빡함
 - 내용 요약도 해볼까? 하는 생각도
## goal
 1. 마인드맵 형식의 웹 메모장
 2. 메모를 로컬 스토리지에 저장
 3. 추후 가능하다면 클라우드에 저장
 4. 추후 가능하다면 메모를 ai모델을 사용해서 요약 및 검색 기능까지...
## develop note
 - develop note도 복잡해져서 진행중인 부분은 `>` 사용
 - 진행이 완료된 부분은 `-` 사용
 - ai모델에 대한 탐색 : BART-base (500MB, 문서보다 단문 요약에 능함)
 - map에 관한 아이디어
   - 디자인은 밤하늘 컨셉으로
   - 개체당 작업
     - 더블 클릭 시 내용 수정 (제목 / 내용)
     - 우클릭으로 삭제 
     - 분화는 어떻게하지?
     - 분화는 8개제한 시계 8방향, 리프노드일 경우만 색으로 구분지어주기
   - page 작업
     - 저장(cloud용 버튼만 일단)
     - 공유(hex변환 page)
     - 정리(집나간 개체들 가운데 모아주기)
   - drag div 만들어서 직접 연결하기 -> react flow에 스타일 붙이기로 변경
 - 작업중... darge sort : edge handle problem
 - edge변경작업을 하며 느꼈는데 진지하게 공부해서 redux를 추가해야겠다
 - redux하다가 꼬이고 내가 원하는 커스텀 상태에서 handle 수직/수평이 결국 안되는거에 화나서 그냥 connectedLine으로 변경 결정
 - selectedNode작업 복잡해서 정리가 안된다 여기에 정리함(redux 값 변화)
   - 노드클릭(FlowCanvas/onNodeClick)
     - setSelectedNode (empty -> id)
     - setsLabel (empty -> label)
     - setsFontSize (empty -> fontSize)
   - 판넬오픈(NodePanel)
     - empty -> state.flow.sLabel
     - empty -> state.flow.sFontSize
   - 판넬작성후apply(NodePanel/applySelectedNode)
     - setsLabel (label -> newLabel)
     - setsFontSize (fontSize -> newFontSize)
     - activateApplyFlag (false -> true)
   - 캔버스업데이트(FlowCanvas/useEffect)
     - deactivateApplyFlag (true -> false)
     - clearSelectedNode (id -> empty)
     - clearsLabel (newLabel -> empty)
     - clearsFontSize (newFontSize -> empty)
   - 추후 추가될 노드 수정작업은 위에 추가해서 정리하는걸로
 - Node-Line-Edge 구성 및 노드 수정 및 연동 기능 완료
 > 뭘해야할지 적어야지?
   - ~~modification function에 width height도 넣어보고싶은데~~ -> 취소 : relative로 변경
   - ~~resizer 좀만 더 확인해보기...~~ -> relative로 변경하며 확인할 필요가 없어짐
   - ~~새 노드 생성기/복제를 잊어버리면 어떡함?????????~~ -> DnD와 adder방식중에 후자 채택(DnD하면 사이드바가 생겨야하는데 사이드바는 프로젝트 ui 컨셉과 안맞음)
   - ~~새 노드 생성기+ 작업할 때 서브플로우 꼭 확인할것~~ -> 확인 결과 그룹화는 ui 컨셉에 안맞음
   > 미니맵 괜찮아보이는데 생각해볼것
   - utils에 layout.js 다시 활성화하기 이번엔 dargejs 하다가 잘 안되면 elkjs도 고려하기
   - FitView layout할때 추가하기