interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="top-0 z-40" style={{borderBottom: "1px solid #FFF",
background: "linear-gradient(90deg, rgba(217, 217, 217, 0.15) 24.76%, rgba(217, 217, 217, 0.00) 100%)", backdropFilter: "blur(10px)"
}}>
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6">
            <a href="#" className="hover:text-slate-600 cursor-pointer text-white text-lg">
              Sherlock 
            </a>
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
   
  );
}
