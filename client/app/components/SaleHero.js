import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#f5f5f5] overflow-hidden flex flex-col">
      {/* Background Accent Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[25vw] font-black text-black/[0.03] leading-none uppercase select-none">
          Limited
        </span>
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-bold tracking-widest uppercase">
              Exclusive Collection 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
              Mega <br /> 
              <span className="text-orange-500">Shoe</span> Sale
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
              Up to <span className="text-slate-900 font-bold text-2xl">50% Off</span> on Selected Styles. 
              Step into comfort without breaking the bank.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <button className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-slate-900/20">
              SHOP NOW
            </button>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 line-through text-lg">$120.00</span>
              <span className="text-3xl font-black text-slate-900">$59.99</span>
            </div>
          </div>
        </div>

        {/* Right Content: The Image */}
        <div className="order-1 lg:order-2 relative flex items-center justify-center">
          {/* Animated Background Glow */}
          <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] bg-orange-400/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative w-full aspect-square max-w-[600px] transform hover:scale-105 transition-transform duration-700 ease-out">
            <Image
              src="/images/sh1.jpg" // Path to your image in public folder
              alt="Promotional Sneaker"
              fill
              priority // High priority loading for Hero images
              className="object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)] rotate-[-15deg]"
            />
            
            {/* Discount Floating Tag */}
            <div className="absolute -top-4 -right-4 md:right-0 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 rotate-12 flex flex-col items-center justify-center animate-bounce">
              <span className="text-4xl font-black text-orange-500">50%</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Discount</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;