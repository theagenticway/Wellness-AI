import { useState } from 'react';
import { User } from '../types/user';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface NutritionModuleProps {
  user: User;
}

export function NutritionModule({ user }: NutritionModuleProps) {
  const [activeTab, setActiveTab] = useState('Meal Plans');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nutrition</h1>
      </div>

      <div className="flex border-b mb-4">
        <TabButton
          label="Meal Plans"
          isActive={activeTab === 'Meal Plans'}
          onClick={() => setActiveTab('Meal Plans')}
        />
        <TabButton
          label="Food Database"
          isActive={activeTab === 'Food Database'}
          onClick={() => setActiveTab('Food Database')}
        />
        <TabButton
          label="Dietary Tracking"
          isActive={activeTab === 'Dietary Tracking'}
          onClick={() => setActiveTab('Dietary Tracking')}
        />
      </div>

      <div>
        {activeTab === 'Meal Plans' && <MealPlans />}
        {/* Add other tab content here */}
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium ${
        isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function MealPlans() {
  return (
    <div className="space-y-4">
      <MealPlanCard
        title="Personalized Meal Plan"
        description="Tailored to your dietary needs and preferences."
        image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        buttonText="View"
      />
      <MealPlanCard
        title="Quick & Easy Recipes"
        description="Delicious recipes for busy days."
        image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        buttonText="Explore"
      />
      <MealPlanCard
        title="Vegetarian & Vegan Options"
        description="Plant-based meals for a healthy lifestyle."
        image="https://images.unsplash.com/photo-1490645935967-10de6ba17021?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        buttonText="Discover"
      />
    </div>
  );
}

function MealPlanCard({ title, description, image, buttonText }: { title: string, description: string, image: string, buttonText: string }) {
  return (
    <Card className="flex items-center p-4">
      <div className="flex-1 mr-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-500 mb-2">{description}</p>
        <Button size="sm">{buttonText}</Button>
      </div>
      <img src={image} alt={title} className="w-24 h-24 rounded-lg object-cover" />
    </Card>
  );
}
