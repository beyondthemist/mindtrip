// import React, { useState } from 'react';
import MyPostit from "../../../components/MyPostit/MyPostit";

// interface Memo {
//   date: Date;
//   content: string;
// }

// interface Props {
//   memos: Memo[]; // Memo 배열을 props로 받음
// }

function MypageHistory() {
  return (
    <div className="bg-[#f4c2c2] flex justify-end flex-col h-[80vh] relative">
      <div className="flex justify-center items-center h-[80vh]">
      <div>
        <MyPostit />
      </div>
    </div>
    </div>
  );
}

export default MypageHistory;
