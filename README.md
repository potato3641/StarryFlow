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
 3. ~~추후 가능하다면 클라우드에 저장~~ -> URL로 변경
 4. ~~추후 가능하다면 메모를 ai모델을 사용해서 요약 및 검색 기능까지...~~ -> 소켓 통신을 이용한 양방향 협업 기능
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
     - ~~공유(hex변환 page)~~
     - ~~share는 base64거쳐서, 서버로는 compress만~~
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
     - empty -> state.flow.defaultNodeColor
     - empty -> state.flow.defaultEdgeColor
     - empty -> state.flow.defaultValue
   - 판넬작성후apply(NodePanel/applySelectedNode)
     - setsLabel (label -> newLabel)
     - setsFontSize (fontSize -> newFontSize)
     - activateApplyFlag (false -> true)
     - setDefaultNodeColor (nodecolor -> newNodeColor)
     - setDefaultEdgeColor (edgecolor -> newEdgeColor)
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
 - ~~gh pages deploy하기~~ -> 완료
  - ~~ai모델에 대한 탐색 : BART-base (500MB, 문서보다 단문 요약에 능함)~~ -> 좋은건 너무 크거나 라이센스 문제가 있고 그게 해결된것들은 오류만 뱉거나 한국어를 잘 못함
 - 1차 사용성 점검
   - 고쳐야할 버그
     - ~~settings 가기전에 navdial 바뀌기~~
     - ~~turbo 상태일때 노드 색상 변경 기능 숨기기~~
     - ~~줄바꿈 강제로 생기게 하는 max-width 확인하기~~ -> 300px에서 500px로
     - ~~elk 사용 직후 turbo 선이 안보임~~
     - ~~elk layered 정렬 종류 살펴보고 바꾸거나/포기하기~~ -> mrtree로 변경
     - ~~turbo로 나갔지만 재진입시 기본css임~~
       - ~~이 때 자식 connect 안되는 버그 발생~~
     - ~~재진입시 localstorage에서 안불러옴~~
     - ~~turbo의 fit이 아슬아슬함. turbo일때는 더 조여야할듯~~
     - ~~turbo의 nodeNode간격 넓혀야~~
     - ~~노드 생성범위를 좁혀야...~~
   - 필요한 기능
     - ~~노드의 선 색을 바꾸는 기능도 추가했으면~~
     - ~~노드 설정에 visible 추가하기 (개인설정?)~~ -> mrtree 변환 이후실효성이 없음
     - ~~compress - base64~~
     - ~~역변환기능도~~
     - ~~map 초기화기능~~
 - 소켓관련 자료 수집
 - 사전 규약 설정하기
   - 필요한 기능?
     - 노드 Position (x, y) - "node_move"
      ```JSON
        {
          type: "node_move",
          payload: {
            id,
            position: {
              x,
              y
            }
          }
        }
      ```
     - 노드 변경 (label) - "node_update"
      ```JSON
        {
          type: "node_update"
          payload: {
            id,
            label,
            fontSize
          }
        }
      ```
     - 노드 생성 - "node_add"
      ```JSON
        {
          type: "node_add"
          payload: {
            id,
            position: {
              x,
              y
            }
          }
        }
      ```
     - 노드 삭제 - "node_delete"
      ```JSON
        {
          type: "node_delete"
          payload: {
            id
          }
        }
      ```
     - 엣지 삭제 - "edge_delete"
      ```JSON
        {
          type: "edge_delete"
          payload: {
            id
          }
        }
      ```
     - ELK 실행 - "elk_layout"
      ```JSON
        {
          type: "elk_layout"
        }
      ```
     - 엣지 생성 - "edge_add"
      ```JSON
        {
          type: "edge_add"
          payload: {
            id,
            source,
            target,
          }
        }
      ```
 - 보안관련 자료수집
 - 제작중인 기능
   - ~~노드 Position (x, y) - "node_move"~~ -> 완료
   - ~~노드 변경 (label) - "node_update"~~ -> 완료
   - ~~노드 생성 - "node_add"~~ -> 완료
   - ~~노드 삭제 - "node_delete"~~ -> 완료
   - ~~엣지 삭제 - "edge_delete"~~ -> 완료
   - ~~ELK 실행 - "elk_layout"~~ -> 완료
   - ~~엣지 생성 - "edge_add"~~ -> 완료
   - ~~노드 삭제 / 엣지 삭제 시 연결부분 로그 서버에서 삭제처리하기(로그최적화)~~
 - ~~canvas 사설방과 로컬방 분리하기~~ -> 완료
 - ~~서버 - 클라이언트B로 데이터 동기화하는 부분~~ -> 완료
 - 현재 클라이언트 - 서버 소켓 연결 완료
 - ~~클라이언트에서 동기화된 데이터를 처리하는 부분이 없다~~ -> 완료
 - ~~일단 로그에서 move는 최종상태만 저장할것~~ -> 완료
 - go set부분이 문제다. settings할 때 task를 멈추게해야하나?
   - ~~stop을 넣어서 2초뒤에 settings에 진입할 수 있도록 해야하나?~~
   - ~~settings에 대한 변경은 어떻게 적용할까?~~
   - ~~zoomout이 고집인가?~~
   - ~~그럼 어떻게바꿀것인가?~~
   - broadcast 메세지를 modeflag로 분기해서 tempRef에 처리
## develop task - progress
 - go set 변경점 이후 테스트하기
 - go canvas 변겅점 이후 테스트하기
## develop task - wait
 - aws ec2 서버 구축하기
 - oracle cloud 정상화되면 다시 구동할생각도
 - compress 서버 전송 테스트하기
 - redis 사용예정