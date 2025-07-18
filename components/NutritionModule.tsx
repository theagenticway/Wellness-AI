import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User } from '../types/user';
import { 
  Apple, 
  ShoppingCart, 
  Clock, 
  Utensils,
  Target,
  Sparkles,
  RefreshCw,
  ChefHat,
  Pill
} from 'lucide-react';

interface NutritionModuleProps {
  user: User;
}

interface NutritionPlan {
  mealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  shoppingList: string[];
  supplementProtocol: {
    morning: string[];
    evening: string[];
    notes: string;
  };
  phaseGuidance: string;
  fiberBreakdown: {
    target: number;
    sources: Array<{
      food: string;
      amount: string;
      fiber: string;
    }>;
  };
}

export function NutritionModule({ user }: NutritionModuleProps) {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'shopping' | 'supplements'>('meals');

  const currentPhase = user.currentPhase || 'phase1';
  
  const phaseInfo = {
    phase1: { 
      name: 'Foundation Phase', 
      description: '100% whole foods, 30-50g fiber daily, no intermittent fasting',
      color: 'from-green-500 to-emerald-600',
      focus: 'Microbiome Reset'
    },
    phase2: { 
      name: 'Transformation Phase', 
      description: '80/20 nutrition approach, weekly 12:12 intermittent fasting',
      color: 'from-blue-500 to-indigo-600',
      focus: 'Habit Formation'
    },
    phase3: { 
      name: 'Optimization Phase', 
      description: 'Flexible eating patterns, sustainable intermittent fasting',
      color: 'from-purple-500 to-violet-600',
      focus: 'Lifestyle Maintenance'
    }
  };

  // Fetch real AI nutrition plan
  const fetchNutritionPlan = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);

    try {
      const response = await fetch('http://localhost:3001/api/wellness/nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...user,
            currentPhase: currentPhase,
            age: user.age || 35,
            healthGoals: user.healthGoals || ['improve-gut-health'],
            preferences: {
              dietary: user.dietaryPreferences || [],
              exercise: user.exercisePreferences || [],
              communication: 'detailed'
            }
          },
          dietaryPreferences: user.dietaryPreferences || []
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNutritionPlan(result.data);
        console.log('✅ Real AI nutrition plan loaded:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch nutrition plan');
      }
    } catch (err: any) {
      console.error('❌ Error fetching nutrition plan:', err);
      
      // Fallback nutrition plan
      setNutritionPlan({
        mealPlan: {
          breakfast: 'Chia pudding with mixed berries and almond butter',
          lunch: 'Large rainbow salad with chickpeas and tahini dressing',
          dinner: 'Baked wild salmon with roasted vegetables and quinoa',
          snacks: ['Apple with raw almonds', 'Celery with hummus']
        },
        shoppingList: [
          'Organic leafy greens (spinach, kale, arugula)',
          'Rainbow vegetables (bell peppers, carrots, beets)',
          'Wild-caught fish and grass-fed proteins',
          'Nuts, seeds, and avocados',
          'Fermented foods (sauerkraut, kimchi)',
          'Whole grains (quinoa, brown rice, oats)'
        ],
        supplementProtocol: {
          morning: ['Multi-strain probiotic', 'Vitamin D3 with K2', 'B-Complex'],
          evening: ['Magnesium glycinate', 'Omega-3 EPA/DHA'],
          notes: 'Take with meals for optimal absorption. Start probiotics gradually.'
        },
        phaseGuidance: phaseInfo[currentPhase].description,
        fiberBreakdown: {
          target: currentPhase === 'phase1' ? 45 : currentPhase === 'phase2' ? 40 : 35,
          sources: [
            { food: 'Chia seeds', amount: '2 tbsp', fiber: '10g' },
            { food: 'Artichoke', amount: '1 medium', fiber: '10g' },
            { food: 'Black beans', amount: '1/2 cup', fiber: '8g' },
            { food: 'Avocado', amount: '1 medium', fiber: '7g' }
          ]
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNutritionPlan();
  }, [user, currentPhase]);

  const tabs = [
    { id: 'meals', label: 'Meal Plans', icon: Utensils },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'supplements', label: 'Supplements', icon: Pill }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-lg font-medium">Generating your personalized nutrition plan...</p>
          <p className="text-sm text-gray-600 mt-2">Our AI is creating GMRP-compliant meals for your phase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${phaseInfo[currentPhase].color} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">GMRP Nutrition Plan</h1>
            <p className="text-blue-100 mb-4">{nutritionPlan?.phaseGuidance || phaseInfo[currentPhase].description}</p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {phaseInfo[currentPhase].name}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {phaseInfo[currentPhase].focus}
              </Badge>
            </div>
          </div>
          <Button 
            onClick={() => fetchNutritionPlan(false)}
            disabled={refreshing}
            variant="secondary" 
            size="sm"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {refreshing ? 'Refreshing...' : 'Generate New Plan'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Fiber Target Card */}
      {nutritionPlan?.fiberBreakdown && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">Daily Fiber Target</h3>
                <p className="text-2xl font-bold text-green-600">{nutritionPlan.fiberBreakdown.target}g</p>
                <p className="text-sm text-green-700">Essential for gut microbiome health</p>
              </div>
              <Target className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === 'meals' && nutritionPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meals */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  <span>Today's Meals</span>
                  <Badge variant="outline">AI Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">🌅 Breakfast</h4>
                  <p className="text-sm text-yellow-700">{nutritionPlan.mealPlan.breakfast}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">☀️ Lunch</h4>
                  <p className="text-sm text-green-700">{nutritionPlan.mealPlan.lunch}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">🌙 Dinner</h4>
                  <p className="text-sm text-blue-700">{nutritionPlan.mealPlan.dinner}</p>
                </div>
                
                {nutritionPlan.mealPlan.snacks && nutritionPlan.mealPlan.snacks.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">🍎 Snacks</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      {nutritionPlan.mealPlan.snacks.map((snack, index) => (
                        <li key={index}>• {snack}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fiber Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="h-5 w-5 text-green-600" />
                <span>Fiber Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nutritionPlan.fiberBreakdown.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">{source.food}</p>
                      <p className="text-sm text-green-600">{source.amount}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {source.fiber}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  💡 Tip: Spread fiber intake throughout the day for optimal digestion
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'shopping' && nutritionPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>AI-Generated Shopping List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nutritionPlan.shoppingList.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm font-medium flex-1">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Button className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order via Instacart
              </Button>
              <Button variant="outline" className="flex-1">
                Export to Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'supplements' && nutritionPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Morning Supplements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nutritionPlan.supplementProtocol.morning.map((supplement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <input type="checkbox" className="rounded" />
                    <Pill className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium flex-1">{supplement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Evening Supplements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nutritionPlan.supplementProtocol.evening.map((supplement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <input type="checkbox" className="rounded" />
                    <Pill className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium flex-1">{supplement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">{nutritionPlan.supplementProtocol.notes}</p>
              </div>
              
              <div className="mt-4">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Supplements via iHerb
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase-specific guidance */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Sparkles className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">GMRP {phaseInfo[currentPhase].name} Guidance</h3>
              <p className="text-sm text-indigo-700 mb-3">{nutritionPlan?.phaseGuidance}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                  Focus: {phaseInfo[currentPhase].focus}
                </Badge>
                {currentPhase === 'phase1' && (
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    No Intermittent Fasting
                  </Badge>
                )}
                {currentPhase === 'phase2' && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    12:12 IF Once Weekly
                  </Badge>
                )}
                {currentPhase === 'phase3' && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Flexible IF Patterns
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}