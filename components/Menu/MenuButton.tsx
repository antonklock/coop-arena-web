type MenuButtonProps = {
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
};

export const MenuButton = (props: MenuButtonProps) => {
  const { showMenu, setShowMenu } = props;
  return (
    <>
      <div className="flex flex-col justify-end items-end gap-3">
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex flex-col gap-1 justify-center items-center w-10 h-10 m-4 rounded-full bg-red-600 border-2 border-red-200 opacity-75 hover:opacity-100 drop-shadow-xl"
        >
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
        </div>
      </div>
    </>
  );
};
