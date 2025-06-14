const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-9 pt-25">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {
                        [...Array(9)].map((box, i) => (
                            <div
                                key={i}
                                className={`size-35 aspect-square rounded-2xl bg-primary/10 ${ i % 2 === 0 ? "animate-pulse" : "" }
                                ${ i % 2 !== 0 ? "animate-pulse" : "" }`}
                                style={{ animationDelay: i % 2 !== 0 ? "0.5s" : "0.125s" }}
                            />
                        ))
                    }
                </div>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};
  
export default AuthImagePattern;