import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Composant d'exemple montrant l'utilisation du système de traduction
 */
const TranslationExample: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('navigation.home')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t('home.hero.subtitle')}</p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleLanguageChange('fr')}
          >
            Français
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleLanguageChange('en')}
          >
            English
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleLanguageChange('es')}
          >
            Español
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Langue actuelle: {i18n.language}</p>
          <p>{t('common.loading')}</p>
          <p>{t('cart.title')}: {t('cart.itemCount', { count: 5 })}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationExample;