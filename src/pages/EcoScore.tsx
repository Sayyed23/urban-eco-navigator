
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
import { Award, Trophy, Leaf, TreeDeciduous, MapPin, CheckCircle, ArrowUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface AcceptedChallenge {
  challengeId: string;
  city: string;
  impact: {
    air_quality: number;
    green_cover: number;
    user_actions: number;
  }
}

const EcoScore = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [activeTab, setActiveTab] = useState('scores');
  const [acceptedChallenges, setAcceptedChallenges] = useState<AcceptedChallenge[]>([]);
  const [scoresWithImpact, setScoresWithImpact] = useState<EcoScore[]>([]);
  
  // Fetch eco scores from Supabase
  const {
    data: ecoScores = [],
    isLoading,
    error,
  } = useQuery<EcoScore[]>({
    queryKey: ['ecoScores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_scores')
        .select('*')
        .order('total_score', { ascending: false });
      
      if (error) throw error;
      return data as EcoScore[] || [];
    }
  });
  
  // Fetch challenges
  const { data: challenges = [] } = useQuery<EcoChallenge[]>({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_challenges')
        .select('*');
      
      if (error) throw error;
      return data as EcoChallenge[] || [];
    }
  });

  // Calculate scores with impact from accepted challenges
  useEffect(() => {
    if (ecoScores.length > 0) {
      const updatedScores = ecoScores.map(score => {
        // Get challenges accepted for this city
        const cityChallenges = acceptedChallenges.filter(c => c.city === score.city);
        
        if (cityChallenges.length === 0) return score;
        
        // Calculate total impact
        const impacts = cityChallenges.reduce((acc, challenge) => {
          return {
            air_quality: acc.air_quality + challenge.impact.air_quality,
            green_cover: acc.green_cover + challenge.impact.green_cover,
            user_actions: acc.user_actions + challenge.impact.user_actions
          };
        }, { air_quality: 0, green_cover: 0, user_actions: 0 });
        
        // Create new score with impacts
        return {
          ...score,
          air_quality_score: Math.min(100, score.air_quality_score + impacts.air_quality),
          green_cover_score: Math.min(100, score.green_cover_score + impacts.green_cover),
          user_actions_score: Math.min(100, score.user_actions_score + impacts.user_actions),
          total_score: Math.min(100, score.total_score + Math.floor((impacts.air_quality + impacts.green_cover + impacts.user_actions) / 3))
        };
      });
      
      setScoresWithImpact(updatedScores);
    }
  }, [ecoScores, acceptedChallenges]);

  // Complete a challenge
  const completeChallenge = async (challengeId: string) => {
    if (!selectedCity) {
      toast({
        title: "No City Selected",
        description: "Please select a city first to accept this challenge.",
        variant: "destructive"
      });
      setActiveTab('scores');
      return;
    }
    
    // Find the challenge
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Create a simulated environmental impact based on challenge points
    const impact = {
      air_quality: Math.floor(challenge.points * 0.3),
      green_cover: Math.floor(challenge.points * 0.4),
      user_actions: Math.floor(challenge.points * 0.5)
    };
    
    // Add to accepted challenges
    setAcceptedChallenges(prev => [...prev, {
      challengeId,
      city: selectedCity,
      impact
    }]);
    
    toast({
      title: "Challenge Accepted!",
      description: `You've accepted the "${challenge.title}" challenge for ${selectedCity}. The environmental impact is being monitored.`,
    });
    
    // Switch to scores tab to see the impact
    setActiveTab('scores');
  };

  useEffect(() => {
    if (ecoScores.length > 0 && !selectedCity) {
      setSelectedCity(ecoScores[0]?.city || '');
    }
  }, [ecoScores, selectedCity]);

  // Check if a challenge has been accepted
  const isChallengeAccepted = (challengeId: string): boolean => {
    return acceptedChallenges.some(c => c.challengeId === challengeId);
  };

  // Calculate the improvement for a specific score field
  const getImprovement = (city: string, field: keyof EcoScore): number => {
    const originalScore = ecoScores.find(s => s.city === city);
    const updatedScore = scoresWithImpact.find(s => s.city === city);
    
    if (!originalScore || !updatedScore) return 0;
    return (updatedScore[field] as number) - (originalScore[field] as number);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="h-10 w-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Eco-Score Dashboard</h1>
          </div>
          
          <p className="text-lg text-gray-700 mb-4">
            Track your city's environmental score and complete challenges to improve your local ecosystem.
          </p>

          {/* City Selection Dropdown */}
          <div className="mb-8">
            <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select City to Focus On:
            </label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
            >
              <SelectTrigger className="w-full md:w-[300px]" id="city-select">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {ecoScores.map((score) => (
                  <SelectItem key={score.id} value={score.city}>
                    {score.city}, {score.region || 'Unknown Region'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCity && (
              <p className="text-sm text-green-600 mt-2">
                <MapPin className="inline-block h-4 w-4 mr-1" />
                You're currently focusing on {selectedCity}. Complete challenges to improve its eco-score!
              </p>
            )}
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                          {scoresWithImpact.map((score, i) => (
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
                              <div className="text-xl font-bold text-green-600">
                                {score.total_score}
                                {getImprovement(score.city, 'total_score') > 0 && (
                                  <span className="ml-2 text-sm text-green-500 flex items-center">
                                    <ArrowUp className="h-3 w-3 mr-0.5" />
                                    {getImprovement(score.city, 'total_score')}
                                  </span>
                                )}
                              </div>
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
                          {scoresWithImpact.filter(score => score.city === selectedCity).map(score => (
                            <div key={score.id} className="space-y-6">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">Total Eco-Score</h3>
                                  <div className="flex items-center">
                                    <span className="text-2xl font-bold text-green-600">{score.total_score}/100</span>
                                    {getImprovement(score.city, 'total_score') > 0 && (
                                      <span className="ml-2 text-sm text-green-500 flex items-center">
                                        <ArrowUp className="h-4 w-4 mr-0.5" />
                                        {getImprovement(score.city, 'total_score')}
                                      </span>
                                    )}
                                  </div>
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
                                    <div className="flex items-center">
                                      <span className="font-bold">{score.air_quality_score}</span>
                                      {getImprovement(score.city, 'air_quality_score') > 0 && (
                                        <span className="ml-1 text-xs text-green-500 flex items-center">
                                          <ArrowUp className="h-3 w-3" />
                                          {getImprovement(score.city, 'air_quality_score')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TreeDeciduous className="h-5 w-5 text-green-600" />
                                    <h4 className="font-medium">Green Cover</h4>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Progress value={score.green_cover_score} className="w-3/4 h-2" />
                                    <div className="flex items-center">
                                      <span className="font-bold">{score.green_cover_score}</span>
                                      {getImprovement(score.city, 'green_cover_score') > 0 && (
                                        <span className="ml-1 text-xs text-green-500 flex items-center">
                                          <ArrowUp className="h-3 w-3" />
                                          {getImprovement(score.city, 'green_cover_score')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <h4 className="font-medium">User Actions</h4>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Progress value={score.user_actions_score} className="w-3/4 h-2" />
                                    <div className="flex items-center">
                                      <span className="font-bold">{score.user_actions_score}</span>
                                      {getImprovement(score.city, 'user_actions_score') > 0 && (
                                        <span className="ml-1 text-xs text-green-500 flex items-center">
                                          <ArrowUp className="h-3 w-3" />
                                          {getImprovement(score.city, 'user_actions_score')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Challenges Impact Section */}
                              <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-medium mb-3">Challenge Impact</h3>
                                {acceptedChallenges.filter(c => c.city === selectedCity).length > 0 ? (
                                  <div className="space-y-3">
                                    {acceptedChallenges
                                      .filter(c => c.city === selectedCity)
                                      .map(challenge => {
                                        const challengeDetails = challenges.find(c => c.id === challenge.challengeId);
                                        return (
                                          <div key={challenge.challengeId} className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">{challengeDetails?.title || 'Challenge'}</p>
                                              <div className="flex gap-4 text-xs text-green-700 mt-1">
                                                <span>Air: +{challenge.impact.air_quality}</span>
                                                <span>Green: +{challenge.impact.green_cover}</span>
                                                <span>Actions: +{challenge.impact.user_actions}</span>
                                              </div>
                                            </div>
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">No challenges accepted for {selectedCity} yet. Go to the Challenges tab to improve this city's score!</p>
                                )}
                              </div>
                              
                              <div className="pt-4 text-center">
                                <Button onClick={() => setActiveTab('challenges')}>
                                  Accept Eco Challenges
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
              <div>
                {!selectedCity && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                    <p className="text-amber-800">
                      <strong>Please select a city first</strong> from the dropdown above to accept challenges for that location.
                    </p>
                  </div>
                )}
                
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
                          {isChallengeAccepted(challenge.id) ? (
                            <Button variant="outline" disabled className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Accepted
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => completeChallenge(challenge.id)} 
                              disabled={!selectedCity}
                            >
                              Accept Challenge
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
