
import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "GreenGuide helped me select the perfect trees for my small urban garden. The air feels fresher and my space looks beautiful!",
    author: "Sarah K.",
    location: "Portland, OR"
  },
  {
    quote: "As a city planner, this app has been invaluable for our urban greening initiatives. The data-driven recommendations ensure we plant trees that will thrive.",
    author: "Michael T.",
    location: "Chicago, IL"
  },
  {
    quote: "I used GreenGuide to choose shade trees for my property and saw a noticeable decrease in summer cooling costs. Highly recommended!",
    author: "James L.",
    location: "Austin, TX"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What Our Users Say
          </h2>
          
          <div className="relative">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-center">
                <p className="text-xl text-gray-700 italic mb-8">"{testimonials[currentIndex].quote}"</p>
                <p className="font-medium text-gray-900">{testimonials[currentIndex].author}</p>
                <p className="text-gray-500">{testimonials[currentIndex].location}</p>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevTestimonial}
                className="rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {/* Indicators */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextTestimonial}
                className="rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
