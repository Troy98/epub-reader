import React from 'react';

function LayoutContainer(props) {
  const {
    icon, title, children,
  } = props;

  return (
    <div id="layoutContainer" className="fixed top-10 z-10 w-full flex justify-center">
      <div className="shadow-lg w-10/12 max-w-2xl h-full rounded-xl bg-white overflow-hidden relative">
        <div className="grid w-full h-full grid-cols-8">
          <div className="relative h-10 w-10">
            {icon}
          </div>
          <div className="col-span-7 pt-2 pl-2 sm:pl-3 lg:pl-6 xl:pl-0">
            <div className="pl-2 sm:p-0 font-bold">
              {title}
            </div>
            <div className="pr-4 py-4 flex-1 h-full w-full flex flex-col gap-y-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutContainer;
