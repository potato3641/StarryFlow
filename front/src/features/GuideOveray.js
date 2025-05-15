import './GuideOveray.css';
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const dialTip = [
  '맵 전체를 한눈에 보도록 줌을 조정합니다',
  '노드를 트리 방식으로 정렬합니다',
  'Flow에 대한 기본 세팅을 설정합니다',
  '현재 Flow 정보를 로컬에서 확인 가능한 URL로 저장합니다',
  'Flow를 초기화합니다',
  '가이드를 확인합니다',
  'Host일 경우 나타납니다(Host가 종료하면 연결이 종료됨)',
]

const localTip = [
  '맵을 현재 브라우저에 저장합니다.',
  '브라우저에 저장된 맵을 불러옵니다.',
]

const GuideOveray = ({ roomId, closeGuide }) => {

  const [curPage, setCurPage] = useState(1);
  const totalPage = 5 + dialTip.length + (roomId === 'local' ? 2 : 0);

  const handleNext = () => {
    if (curPage === totalPage)
      closeGuide();
    else
      setCurPage((prev) => Math.min(totalPage, prev + 1));
  };

  return (
    <div className="tutorial" onClick={handleNext}>
      {curPage === 1 && <div className="highlight editor">노드 편집기</div>}
      {curPage === 2 && <div className="highlight snackbar">상태 표시 알림</div>}
      {curPage === 3 && <div className="highlight minimap">Flow 요약<br />미니맵</div>}
      {curPage === 4 && <div className="highlight navigator" style={{ height: `${390 + (roomId === 'local') * 88}px` }}>네비게이션</div>}
      {curPage === 5 && <div>
        <div className="label nav">클릭 시 노드를 생성합니다</div>
        <div className="highlight adder"></div>
      </div>}
      {(roomId === 'local' ? [...localTip, ...dialTip] : dialTip).map((tooltip, idx) =>
        (curPage === idx + 6) && (
          <div key={idx}>
            <div className="label" style={{ marginBottom: `${90 + idx * 44}px`, }}>{tooltip}</div>
            <div className="highlight" style={{ bottom: `${80 + idx * 44}px`, right: '13px', width: '40px', height: '40px' }}></div>
          </div>
        )
      )}
      <div className="closer">
        <IconButton onClick={closeGuide} size="small">
          <CloseIcon fontSize="medium" sx={{ color: 'white' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default GuideOveray;