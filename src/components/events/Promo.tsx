import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function RegistrationCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1592656094267-764a45160876?w=1200')` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
      
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Limited Spots Available
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Elevate Your Game?
            </h3>
            <p className="text-slate-400 mb-6 max-w-lg">
              Join 47 other players who have already secured their spot. Early bird pricing ends soon!
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                Money-back guarantee
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                Small group sizes
              </div>
            </div>
          </div>
          
          {/* Right - Pricing Card */}
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-center mb-4">
              <div className="text-slate-500 text-sm line-through">$149</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/person</span>
              </div>
              <div className="text-emerald-600 text-sm font-medium mt-1">Save $50 - Early Bird Price</div>
            </div>
            
            <div className="space-y-2 mb-6">
              {['Full day training (7+ hours)', 'Professional coaching', 'Lunch included', 'Certificate of completion'].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
            
            <Button 
              className={`w-full h-12 rounded-xl font-semibold text-base bg-blue-600 hover:bg-blue-700 transition-all duration-300 ${isHovered ? 'shadow-lg shadow-blue-500/25' : ''}`}
            >
              Register Now
              <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            
            <p className="text-center text-xs text-slate-400 mt-3">
              Only 13 spots remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}