import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProductFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange }) => {
  const [priceRange, setPriceRange] = React.useState([0, 2000]);
  const [selectedCollections, setSelectedCollections] = React.useState<string[]>([]);
  const [selectedModels, setSelectedModels] = React.useState<string[]>([]);

  const collections = [
    'SPORT',
    'LIFESTYLE',
    'PRISMATIC'
  ];

  const models = [
    'Music Shield',
    'Falcon',
    'Shield',
    'Prime',
    'Duck Classic',
    'Dragon',
    'Aura',
    'Euphoria'
  ];

  const handleCollectionChange = (collection: string, checked: boolean) => {
    if (checked) {
      setSelectedCollections([...selectedCollections, collection]);
    } else {
      setSelectedCollections(selectedCollections.filter(c => c !== collection));
    }
  };

  const handleModelChange = (model: string, checked: boolean) => {
    if (checked) {
      setSelectedModels([...selectedModels, model]);
    } else {
      setSelectedModels(selectedModels.filter(m => m !== model));
    }
  };

  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Trier par</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pertinence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Pertinence</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
              <SelectItem value="newest">Plus récent</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Prix</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{priceRange[0]}€</span>
              <span>{priceRange[1]}€</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Collections */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Collections</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {collections.map((collection) => (
              <div key={collection} className="flex items-center space-x-2">
                <Checkbox
                  id={`collection-${collection}`}
                  checked={selectedCollections.includes(collection)}
                  onCheckedChange={(checked) => handleCollectionChange(collection, checked as boolean)}
                />
                <Label htmlFor={`collection-${collection}`} className="text-sm">
                  {collection}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Models */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <Label className="text-sm font-medium">Modèles</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {models.map((model) => (
              <div key={model} className="flex items-center space-x-2">
                <Checkbox
                  id={`model-${model}`}
                  checked={selectedModels.includes(model)}
                  onCheckedChange={(checked) => handleModelChange(model, checked as boolean)}
                />
                <Label htmlFor={`model-${model}`} className="text-sm">
                  {model}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Clear filters */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            setSelectedCollections([]);
            setSelectedModels([]);
            setPriceRange([0, 2000]);
          }}
        >
          Effacer les filtres
        </Button>
      </CardContent>
    </Card>
  );
};