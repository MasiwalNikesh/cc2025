import { Button } from './ui/button'
import { MessageSquare, Star } from 'lucide-react'

interface CTASectionProps {
  onRequestConsultation: () => void
  onShareFeedback: () => void
}

const CTASection = ({ onRequestConsultation, onShareFeedback }: CTASectionProps) => {
  return (
    <section className="bg-gradient-to-br from-secondary-600 to-secondary-500 py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="max-w-4xl text-center">
            <div className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 text-xs font-semibold tracking-wide text-white">
                GET IN TOUCH
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{textShadow: '0 2px 20px rgba(0,0,0,0.2)'}}>
              Ready to Protect Your Assets?
            </h2>

            <p className="text-xl mb-12 text-white/95 max-w-2xl mx-auto leading-relaxed">
              Connect with our experts for personalized solutions or share your valuable feedback to help us serve you better
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onRequestConsultation}
                size="lg"
                className="bg-white text-secondary-700 hover:bg-primary-50 hover:text-primary-700 flex items-center justify-center gap-3 font-semibold px-8 py-6 rounded-full min-w-[250px] shadow-xl transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" />
                Request Consultation
              </Button>

              <Button
                onClick={onShareFeedback}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-secondary-700 flex items-center justify-center gap-3 font-semibold px-8 py-6 rounded-full min-w-[250px] bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <Star className="w-5 h-5" />
                Share Feedback
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
              {[
                { number: '50+', label: 'Years Combined Experience' },
                { number: '1000+', label: 'Projects Completed' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat, index) => (
                <div key={index} className="text-white">
                  <div className="text-5xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated background effect */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-pulse-slow pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      </div>
    </section>
  )
}

export default CTASection
