import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSelector: React.FC = () => {
  const {
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    getLanguageFlag
  } = useLanguage();

  const currentLang = getCurrentLanguage();
  const supportedLanguages = getSupportedLanguages();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="text-base">
            {getLanguageFlag(currentLang)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {Object.entries(supportedLanguages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            className={`cursor-pointer ${
              currentLang === code ? 'bg-muted' : ''
            }`}
          >
            <span className="mr-3 text-base">{flag}</span>
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;