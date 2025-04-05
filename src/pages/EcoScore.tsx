
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Award, Trophy, Leaf, TreeDeciduous, MapPin } from 'lucide-react';

// Define types for our data
interface EcoScore {
  id: string;
  city: string;
  region: string | null;
  air_quality_score: number;
  green_cover_score: number;
  user_actions_score: number;
  total_score: number;
  created_at: string | null;
  updated_at: string | null;
}

interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  created_at: string | null;
}

const EcoScore = () => {
  const [selectedCity, setSelectedCity] = useState('');
  
  // Fetch eco scores from Supabase
  const {
    data: ecoScores = [],
    isLoading,
    error,
  } = useQuery<EcoScore[]>({
    queryKey: ['ecoScores'],
    queryFn: async () => {
      // Cast the response to any first, then to our defined type
      const { data, error } = await supabase
        .from('eco_scores')
        .select('*')
        .order('total_score', { ascending: false }) as any;
      
      if (error) throw error;
      return data as EcoScore[] || [];
    }
  });
  
  // Fetch challenges
  const { data: challenges = [] } = useQuery<EcoChallenge[]>({
    queryKey: ['challenges'],
    queryFn: async () => {
      // Cast the response to any first, then to our defined type
      const { data, error } = await supabase
        .from('eco_challenges')
        .select('*') as any;
      
      if (error) throw error;
      return data as EcoChallenge[] || [];
    }
  });

  // Complete a challenge (simulated for now)
  const completeChallenge = async (challengeId: string) => {
    // In a real app, we'd verify completion and update the database
    toast({
      title: "Challenge Accepted!",
      description: "You've started working on this challenge.",
    });
  };

  useEffect(() => {
    if (ecoScores.length > 0 && !selectedCity) {
      setSelectedCity(ecoScores[0].city);
    }
  }, [ecoScores, selectedCity]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="h-10 w-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Eco-Score Dashboard</h1>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">
            Track your city's environmental score and complete challenges to improve your local ecosystem.
          </p>
          
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="scores">City Scores</TabsTrigger>
              <TabsTrigger value="challenges">Eco Challenges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scores">
              {isLoading ? (
                <div className="text-center py-10">Loading city scores...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">Error loading eco scores</div>
              ) : (
                <div className="grid md:grid-cols-12 gap-8">
                  {/* City Leaderboard */}
                  <div className="md:col-span-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-green-600" />
                          <span>City Leaderboard</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {ecoScores.map((score, i) => (
                            <div 
                              key={score.id} 
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                                selectedCity === score.city ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedCity(score.city)}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full 
                                  ${i === 0 ? 'bg-amber-100 text-amber-600' : 
                                    i === 1 ? 'bg-slate-100 text-slate-600' : 
                                    i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
                                >
                                  {i + 1}
                                </span>
                                <div>
                                  <p className="font-medium">{score.city}</p>
                                  <p className="text-sm text-gray-500">{score.region}</p>
                                </div>
                              </div>
                              <div className="text-xl font-bold text-green-600">{score.total_score}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Selected City Score Details */}
                  <div className="md:col-span-8">
                    {selectedCity && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            <span>{selectedCity} Environmental Score</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {ecoScores.filter(score => score.city === selectedCity).map(score => (
                            <div key={score.id} className="space-y-6">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">Total Eco-Score</h3>
                                  <span className="text-2xl font-bold text-green-600">{score.total_score}/100</span>
                                </div>
                                <Progress value={score.total_score} className="h-3" />
                              </div>
                              
                              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Leaf className="h-5 w-5 text-green-600" />
                                    <h4 className="font-medium">Air Quality</h4>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Progress value={score.air_quality_score} className="w-3/4 h-2" />
                                    <span className="font-bold">{score.air_quality_score}</span>
                                  </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TreeDeciduous className="h-5 w-5 text-green-600" />
                                    <h4 className="font-medium">Green Cover</h4>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Progress value={score.green_cover_score} className="w-3/4 h-2" />
                                    <span className="font-bold">{score.green_cover_score}</span>
                                  </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <h4 className="font-medium">User Actions</h4>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Progress value={score.user_actions_score} className="w-3/4 h-2" />
                                    <span className="font-bold">{score.user_actions_score}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-4 text-center">
                                <Button onClick={() => toast({
                                  title: "More Data Coming Soon",
                                  description: "Detailed environmental metrics will be available in future updates."
                                })}>
                                  View Detailed Metrics
                                </Button>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="challenges">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                  <Card key={challenge.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{challenge.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {challenge.points} points
                        </div>
                        <Button onClick={() => completeChallenge(challenge.id)}>
                          Accept Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EcoScore;
