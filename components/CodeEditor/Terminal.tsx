import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Terminal as Xterm } from '@xterm/xterm'
import "@xterm/xterm/css/xterm.css";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { constructNow, intlFormat } from 'date-fns';

interface TermainlProps {
  height: number
  onResizeStart: () => void
}

const Terminal: React.FC<TermainlProps> = ({ height, onResizeStart }) => {
  const terminalRef = useRef(null);
  const isRender = useRef(false);
  const [command, setCommand] = useState();
  const socket = useSelector((state: RootState) => state.socket?.socket);

  useEffect(() => {
    if (isRender.current) return;
    isRender.current = true;

    let term = new Xterm({
      rows: 20,
      cols: 80
    })

    if (terminalRef && terminalRef.current) {
      term.open(terminalRef.current);
      term.onData((data) => {
        socket?.emit("write:cmd", data);
      })

      socket?.on("output:cmd", (data) => {
        term.write(data);
      })
    }
  }, [])

  return (
    <div className='w-full outline p-1 outline-1 outline-gray-900 cursor-s-resize ' style={{ height: height }} onMouseDown={onResizeStart}>
      <div className='w-full h-full'>
        <div ref={terminalRef}></div>
      </div>
    </div>
  )
}

export default Terminal