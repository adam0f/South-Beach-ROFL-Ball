export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO';
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}

export const BG = 'bg';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const CLICK = 'click';
export const BALL = 'ball'
export const BOTTOM = 'bottom'
export const CRAB = 'crab'
export const TREES = 'trees'
// export const BOP  = 'bop'
// export const POP = 'pop'

// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: BG,
    src: 'assets/images/bg.png',
    type: 'IMAGE',
  },
  {
    key: LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: CLICK,
    src: 'assets/sounds/click.mp3',
    type: 'AUDIO',
  },
  {
    key: BALL,
    src: 'assets/sprites/ball.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 960 / 2,
      frameHeight: 1920 / 4,
    }
  },
  {
    key: BOTTOM,
    src: 'assets/sprites/bottom.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 1024,
      frameHeight: 96,
    }
  },
  {
    key: CRAB,
    src: 'assets/sprites/crab.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 1920 / 3,
      frameHeight: 1920 / 3,
    }
  },
  {
    key: TREES,
    src: 'assets/images/trees.png',
    type: 'IMAGE',
  },
  // {
  //   key: BOP,
  //   src: 'assets/audio/bop.wav',
  //   type: 'AUDIO',
  // },
  // {
  //   key: POP,
  //   src: 'assets/audio/pop.mp3',
  //   type: 'AUDIO',
  // },
 ];
