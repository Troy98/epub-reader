/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';

function ModalContainer(props) {
  const { setModalOpen, children } = props;
  const ref = useRef(null);

  const handleClick = (e) => {
    if (ref.current === e.target) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handle ESC key
  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative z-30" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div ref={ref} className="fixed inset-0 w-full h-full bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 top-1/2 lg:left-1/2 lg:-translate-x-1/2 -translate-y-1/2 z-10 lg:w-2/3 xl:w-1/2 h-full lg:h-fit flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
