type StartPageProps = {
  handleStart: () => void;
  fadeElementRef: React.RefObject<HTMLDivElement>;
};

export const StartPage = (props: StartPageProps) => {
  const { handleStart, fadeElementRef } = props;
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="flex flex-1 h-full">
        <div
          ref={fadeElementRef}
          id="fadeElement"
          className="flex flex-col justify-center transition-opacity duration-500 ease-out opacity-100"
        >
          <h1 className="text-4xl font-bold mb-2">LHF Intro 24/25</h1>
          <button
            className="bg-red-800 px-8 py-4 rounded-md hover:bg-red-600"
            onClick={handleStart}
          >
            Load arena
          </button>
        </div>
      </div>
    </div>
  );
};
