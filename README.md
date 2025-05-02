# StarryFlow
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
## develop task - complete
 - map에 관한 아이디어
   - 디자인은 밤하늘 컨셉으로
   - 개체당 작업
     - ~~더블 클릭 시 내용 수정 (제목 / 내용)~~ -> NodePanel에서 변경
     - ~~우클릭으로 삭제~~ -> backspace로 삭제
     - ~~분화는 어떻게하지?~~ -> 자유
     - ~~분화는 8개제한 시계 8방향, 리프노드일 경우만 색으로 구분지어주기~~ -> 자유
   - page 작업
     - ~~저장(cloud용 버튼만 일단)~~ -> localstorage로 일단 완료
     - ~~정리(집나간 개체들 가운데 모아주기)~~ -> 완료
   - ~~drag div 만들어서 직접 연결하기~~ -> react flow에 스타일 붙이기로 변경
 - ~~작업중... darge sort : edge handle problem~~ -> elkjs로 변경됨
 - ~~edge변경작업을 하며 느꼈는데 진지하게 공부해서 redux를 추가해야겠다~~ -> 완료
 - ~~redux하다가 꼬이고 내가 원하는 커스텀 상태에서 handle 수직/수평이 결국 안되는거에 화나서 그냥 connectedLine으로 변경 결정~~ -> 완료
 - selectedNode작업 복잡해서 정리가 안된다 여기에 정리함(redux 값 변화)
   - 노드클릭(FlowCanvas/onNodeClick)
     - setSelectedNode (empty -> id)
     - setsLabel (empty -> label)
     - setsFontSize (empty -> fontSize)
   - 판넬오픈(NodePanel)
     - empty -> state.flow.sLabel
     - empty -> state.flow.sFontSize
     - empty -> state.flow.defaultColor
     - empty -> state.flow.defaultValue
   - 판넬작성후apply(NodePanel/applySelectedNode)
     - setsLabel (label -> newLabel)
     - setsFontSize (fontSize -> newFontSize)
     - activateApplyFlag (false -> true)
     - setDefaultNodeColor (color -> newColor)
     - setDefaultNodeValue (value -> newValue)
   - 캔버스업데이트(FlowCanvas/useEffect)
     - deactivateApplyFlag (true -> false)
     - clearSelectedNode (id -> empty)
     - clearsLabel (newLabel -> empty)
     - clearsFontSize (newFontSize -> empty)
   - 추후 추가될 노드 수정작업은 위에 추가해서 정리하는걸로
 - Node-Line-Edge 구성 및 노드 수정 및 연동 기능 완료
 - ~~modification function에 width height도 넣어보고싶은데~~ -> 취소 : relative로 변경
 - ~~resizer 좀만 더 확인해보기...~~ -> relative로 변경하며 확인할 필요가 없어짐
 - ~~새 노드 생성기/복제를 잊어버리면 어떡함?????????~~ -> DnD와 adder방식중에 후자 채택(DnD하면 사이드바가 생겨야하는데 사이드바는 프로젝트 ui 컨셉과 안맞음)
 - ~~새 노드 생성기+ 작업할 때 서브플로우 꼭 확인할것~~ -> 확인 결과 그룹화는 ui 컨셉에 안맞음
 - ~~미니맵 괜찮아보이는데 생각해볼것~~ -> 추가완료
 - ~~save and restore~~ -> 완료
 - ~~utils에 layout.js 다시 활성화하기 이번엔 dargejs 하다가 잘 안되면 elkjs도 고려하기~~ -> elkjs로 완료
 - ~~FitView layout할때 추가하기~~ -> 완료
 - ~~컨셉컨셉 하다보니 이거 프로젝트 제목 컨셉에 안맞는거같은데 프로젝트명을 바꿔야겠는데 편의성을 위해 일단 놔두고 정식명칭을 정해봐야겠음~~ -> starry flow
 - develop note 점점 task목록같아지는데 이거 분할해서 할까?
 - onadd speeddial 클릭문제 해결(icon range)
 - settings에 들어갈 옵션 완성하기
   - minimap on/off flag -> 기능완료 mapFlag
   - node 왼쪽정렬/가운데정렬/오른쪽정렬 (선택박스) -> 기능완료 defaultNodeAlign
   - node color 팔레트 -> 기능완료 defaultNodeColor
   - 정렬 후 자동 Fitview on/off flag -> 기능완료 autoFitViewFlag
   - sort 방향 flag -> 기능완료 sortDirectionFlag
   - cycle 형성 방제 on/off flag -> 기능완료 cycleValidateFlag
   - node default value 변경 -> 기능완료 defaultNodeValue
   - blur node value at min-zoom flag -> 기능완료 zoomOutBlurFlag
 - ~~개편이 필요한것 : connectLine이 너무 얇다 클릭하기 힘들어~~ -> width 2로 늘렸으나 3을 고려해봐야할듯
 - Setting을 모달로 하기보다 기왕 FlowCanvas 만든거 이거 이용해서 fixed nodes갖고 값 바꾸라고 하면 좋을거같다
   - Settings Elk -> 완료
   - Settings Fit -> 완료
 - ~~color 팔레트 react-color로 진행하다 수많은 레거시 버그에 좌초중 react-colorful로 변경 고려~~ -> 변경 완료
 - ~~이제 connect함수 고쳐서 값이 즉각적용되도록 하기~~ -> 완료
 - ~~apply 눌렀을 때 즉각적용하도록 하기~~ -> 완료
 - ~~개편이 필요한것 : nodePanel 엔터키 입력으로도 apply될수있께하기~~ -> 완료
 - ~~아맞다 contextual-zoom on/off도 넣어야함 settings~~ -> 완료
 - ~~turboflow 선택지 만들기~~ -> 완료
## develop task - progress
## develop task - wait
 - map에 관한 아이디어
   - page 작업
     - 공유(hex변환 page)
     - share는 base64거쳐서, 서버로는 compress만
 - ai모델에 대한 탐색 : BART-base (500MB, 문서보다 단문 요약에 능함)