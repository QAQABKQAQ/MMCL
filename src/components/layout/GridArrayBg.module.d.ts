declare module '@/components/layout/GridArrayBg.module.js' {
  export interface GridArrayBgOption {
    dom: string;
    colors?: string[];
    loop?: boolean;
    [key: string]: any;
  }
  
  export class GridArrayBg {
    constructor(options: GridArrayBgOption);
    update?(options: Partial<GridArrayBgOption>): void;
    destroy(): void;
  }
} 