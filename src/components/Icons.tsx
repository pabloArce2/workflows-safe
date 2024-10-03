import {
  Activity,
  AlertTriangle,
  AlignJustify,
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Ban,
  Binary,
  BookOpen,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Circle,
  Command,
  Cpu,
  CreditCard,
  Diamond,
  Dumbbell,
  Eye,
  EyeOff,
  File,
  FileImage,
  FileText,
  Filter,
  FolderX,
  GitCompare,
  Hand,
  HelpCircle,
  Hexagon,
  History,
  Image,
  Info,
  KanbanSquare,
  Languages,
  Laptop,
  Layers,
  Link,
  Loader2,
  LogOut,
  LucideProps,
  Maximize,
  Minimize,
  Minus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  MousePointer2,
  Network,
  Pizza,
  PlayCircle,
  Plus,
  PlusCircle,
  Redo2,
  RotateCcw,
  Ruler,
  Search,
  Settings,
  Sliders,
  SlidersHorizontal,
  Square,
  SunMedium,
  Tag,
  Tags,
  Target,
  Trash,
  Trash2,
  Triangle,
  Twitter,
  Undo2,
  UploadCloud,
  Wand,
  Wrench,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
  type Icon as LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Icon = typeof LucideIcon

export const Icons = {
  activity: Activity,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  logo: Command,
  logOut: LogOut,
  bookOpen: BookOpen,
  badgeCheck: BadgeCheck,
  binary: Binary,
  close: X,
  cancel: XCircle,
  circlePlay: PlayCircle,
  camera: Camera,
  plusCircle: PlusCircle,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronsLeft: ChevronsLeft,
  chevronRight: ChevronRight,
  chevronsRight: ChevronsRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronsUpDown: ChevronsUpDown,
  dumbell: Dumbbell,
  circle: Circle,
  circleOff: Ban,
  brainCircuit: BrainCircuit,
  trash: Trash,
  trash2: Trash2,
  post: FileText,
  page: File,
  mediaFile: FileImage,
  media: Image,
  square: Square,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  moreHorizontal: MoreHorizontal,
  add: Plus,
  subtract: Minus,
  warning: AlertTriangle,
  account: Wrench,
  user: ({ ...props }: any) => (
    <img src="/user-avatar.png" className={cn(props.className, "rounded-full object-cover")} />
  ),
  arrowRight: ArrowRight,
  slidersVertical: Sliders,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowDownToLine: ArrowDownToLine,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  checkCircle: CheckCircle2,
  gitCompare: GitCompare,
  alignJustify: AlignJustify,
  uploadCloud: UploadCloud,
  rotateCcw: RotateCcw,
  search: Search,
  triangle: Triangle,
  target: Target,
  hand: Hand,
  wand: Wand,
  mousePointer2: MousePointer2,
  eye: Eye,
  eyeOff: EyeOff,
  arrowUturnLeft: Undo2,
  arrowUturnRight: Redo2,
  tag: Tag,
  tags: Tags,
  fileImage: FileImage,
  arrowLeftToLine: ArrowLeftToLine,
  language: Languages,
  history: History,
  projects: Layers,
  diamond: Diamond,
  hexagon: Hexagon,
  filter: Filter,
  link: Link,
  ruler: Ruler,
  helpCircle: HelpCircle,
  kanbanSquare: KanbanSquare,
  network: Network,
  cpu: Cpu,
  folderX: FolderX,
  slidersHorizontal: SlidersHorizontal,
  maximaze: Maximize,
  minimize: Minimize,
  informationCircle: Info,

  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  twitter: Twitter,
  check: Check,
  rely: ({ ...props }: LucideProps) => (
    <svg viewBox="0 0 282 100" fill="none" xmlns="http://www.w3.org/2000/svg " {...props}>
      <path
        d="M171.5 43.25C171.5 45.1042 171.271 46.7604 170.812 48.2188C170.354 49.6771 169.729 50.9688 168.938 52.0938C168.167 53.1979 167.271 54.1458 166.25 54.9375C165.229 55.7292 164.156 56.3854 163.031 56.9062C161.927 57.4062 160.802 57.7708 159.656 58C158.531 58.2292 157.469 58.3438 156.469 58.3438L173.438 73H160.875L143.938 58.3438H138.094V50.2188H156.469C157.49 50.1354 158.417 49.9271 159.25 49.5938C160.104 49.2396 160.833 48.7708 161.438 48.1875C162.062 47.6042 162.542 46.9062 162.875 46.0938C163.208 45.2604 163.375 44.3125 163.375 43.25V38.125C163.375 37.6667 163.312 37.3229 163.188 37.0938C163.083 36.8438 162.938 36.6667 162.75 36.5625C162.583 36.4375 162.396 36.3646 162.188 36.3438C162 36.3229 161.823 36.3125 161.656 36.3125H134.844V73H126.719V32.2812C126.719 31.7188 126.823 31.1875 127.031 30.6875C127.24 30.1875 127.521 29.75 127.875 29.375C128.25 29 128.688 28.7083 129.188 28.5C129.688 28.2917 130.229 28.1875 130.812 28.1875H161.656C163.469 28.1875 165 28.5208 166.25 29.1875C167.5 29.8333 168.51 30.6562 169.281 31.6562C170.073 32.6354 170.635 33.6979 170.969 34.8438C171.323 35.9896 171.5 37.0625 171.5 38.0625V43.25ZM214.719 50.4062C214.719 51.5312 214.521 52.75 214.125 54.0625C213.729 55.3542 213.083 56.5625 212.188 57.6875C211.312 58.7917 210.156 59.7188 208.719 60.4688C207.302 61.2188 205.573 61.5938 203.531 61.5938H188.875V53.875H203.531C204.635 53.875 205.49 53.5417 206.094 52.875C206.698 52.1875 207 51.3438 207 50.3438C207 49.2812 206.656 48.4479 205.969 47.8438C205.302 47.2396 204.49 46.9375 203.531 46.9375H188.875C187.771 46.9375 186.917 47.2812 186.312 47.9688C185.708 48.6354 185.406 49.4688 185.406 50.4688V61.8125C185.406 62.8958 185.74 63.7396 186.406 64.3438C187.094 64.9479 187.938 65.25 188.938 65.25H203.531V73H188.875C187.75 73 186.531 72.8021 185.219 72.4062C183.927 72.0104 182.719 71.375 181.594 70.5C180.49 69.6042 179.562 68.4479 178.812 67.0312C178.062 65.5938 177.688 63.8542 177.688 61.8125V50.4062C177.688 49.2812 177.885 48.0729 178.281 46.7812C178.677 45.4688 179.312 44.2604 180.188 43.1562C181.083 42.0312 182.24 41.0938 183.656 40.3438C185.094 39.5938 186.833 39.2188 188.875 39.2188H203.531C204.656 39.2188 205.865 39.4167 207.156 39.8125C208.469 40.2083 209.677 40.8542 210.781 41.75C211.906 42.625 212.844 43.7812 213.594 45.2188C214.344 46.6354 214.719 48.3646 214.719 50.4062ZM235.031 73H231.406C230.24 73 228.99 72.8021 227.656 72.4062C226.344 72.0104 225.115 71.3646 223.969 70.4688C222.823 69.5521 221.875 68.375 221.125 66.9375C220.375 65.4792 220 63.6979 220 61.5938V24.9375H228.125V61.5938C228.125 62.5938 228.438 63.3958 229.062 64C229.688 64.5833 230.469 64.875 231.406 64.875H235.031V73ZM277.5 76.25C277.5 77.6458 277.323 78.8958 276.969 80C276.615 81.125 276.146 82.1042 275.562 82.9375C274.979 83.7917 274.302 84.5104 273.531 85.0938C272.76 85.6979 271.948 86.1875 271.094 86.5625C270.26 86.9375 269.417 87.2083 268.562 87.375C267.708 87.5625 266.896 87.6562 266.125 87.6562H251.469V79.5312H266.125C267.208 79.5312 268.021 79.25 268.562 78.6875C269.104 78.125 269.375 77.3125 269.375 76.25V39.2188H277.5V76.25ZM266.125 73H251.469C250.302 73 249.052 72.8021 247.719 72.4062C246.406 72.0104 245.177 71.3646 244.031 70.4688C242.885 69.5521 241.938 68.375 241.188 66.9375C240.438 65.4792 240.062 63.6979 240.062 61.5938V39.2188H248.188V61.5938C248.188 62.6562 248.469 63.4688 249.031 64.0312C249.594 64.5938 250.427 64.875 251.531 64.875H266.125V73Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M90 0C95.5228 0 100 4.47716 100 10V90C100 95.5229 95.5228 100 90 100H37.6534L51.364 87.5951C59.6307 80.1157 57.9062 66.6866 48.0179 61.5386L36.2613 55.4179C23.2674 48.653 28.0769 29 42.7263 29H67.9998C70.2089 29 71.9998 30.7909 71.9998 33L71.9998 99.9999H83.9998L83.9998 33C83.9998 24.1634 76.8363 17 67.9998 17H42.7263C15.5203 17 6.58834 53.4985 30.7198 66.0618L42.4765 72.1826C44.9486 73.4696 45.3797 76.8268 43.313 78.6967L19.7674 100H10C4.47715 100 0 95.5228 0 90V10C0 4.47715 4.47716 0 10 0H90Z"
        fill="#1C3442"
      />
      <rect width="12" height="12" transform="matrix(-1 0 0 1 84 76)" fill="#FFAC2F" />
    </svg>
  ),
  relyLogo: ({ ...props }: LucideProps) => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M90 0C95.5228 0 100 4.47716 100 10V90C100 95.5229 95.5228 100 90 100H37.6534L51.364 87.5951C59.6307 80.1157 57.9062 66.6866 48.0179 61.5386L36.2613 55.4179C23.2674 48.653 28.0769 29 42.7263 29H67.9998C70.2089 29 71.9998 30.7909 71.9998 33L71.9998 99.9999H83.9998L83.9998 33C83.9998 24.1634 76.8363 17 67.9998 17H42.7263C15.5203 17 6.58834 53.4985 30.7198 66.0618L42.4765 72.1826C44.9486 73.4696 45.3797 76.8268 43.313 78.6967L19.7674 100H10C4.47715 100 0 95.5228 0 90V10C0 4.47715 4.47716 0 10 0H90Z"
        fill="#1C3442"
      />
      <rect width="12" height="12" transform="matrix(-1 0 0 1 84 76)" fill="#FFAC2F" />
    </svg>
  ),
  relyLogoWhite: ({ ...props }: LucideProps) => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M90 0C95.5228 0 100 4.47716 100 10V90C100 95.5229 95.5228 100 90 100H37.6534L51.364 87.5951C59.6307 80.1157 57.9062 66.6866 48.0179 61.5386L36.2613 55.4179C23.2674 48.653 28.0769 29 42.7263 29H67.9998C70.2089 29 71.9998 30.7909 71.9998 33L71.9998 99.9999H83.9998L83.9998 33C83.9998 24.1634 76.8363 17 67.9998 17H42.7263C15.5203 17 6.58834 53.4985 30.7198 66.0618L42.4765 72.1826C44.9486 73.4696 45.3797 76.8268 43.313 78.6967L19.7674 100H10C4.47715 100 0 95.5228 0 90V10C0 4.47715 4.47716 0 10 0H90Z"
        fill="#fff"
      />
      <rect width="12" height="12" transform="matrix(-1 0 0 1 84 76)" fill="#fff" />
    </svg>
  ),

  expand: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  ),
  photo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  ),
  commandLine: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  ),

  cpuChip: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
      />
    </svg>
  ),

  pencil: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
      />
    </svg>
  ),
  arrowUpOnSquare: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
      />
    </svg>
  ),
  bars3BottomRight: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
    </svg>
  ),

  dottedLineRectangle: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 3a2 2 0 0 0-2 2" />
        <path d="M19 3a2 2 0 0 1 2 2" />
        <path d="M21 19a2 2 0 0 1-2 2" />
        <path d="M5 21a2 2 0 0 1-2-2" />
        <path d="M9 3h1" />
        <path d="M9 21h1" />
        <path d="M14 3h1" />
        <path d="M14 21h1" />
        <path d="M3 9v1" />
        <path d="M21 9v1" />
        <path d="M3 14v1" />
        <path d="M21 14v1" />
      </svg>
    </svg>
  ),

  spainFlag: ({ ...props }: LucideProps) => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_2_5784)">
        <path
          d="M0.000976562 256C0.000976562 287.314 5.63398 317.31 15.924 345.043L256.001 367.304L496.078 345.043C506.368 317.31 512.001 287.314 512.001 256C512.001 224.686 506.368 194.69 496.078 166.957L256.001 144.696L15.924 166.957C5.63398 194.69 0.000976563 224.686 0.000976563 256H0.000976562Z"
          fill="#FFDA44"
        />
        <path
          d="M496.078 166.957C459.907 69.473 366.072 0 256.001 0C145.93 0 52.095 69.473 15.924 166.957H496.078Z"
          fill="#D80027"
        />
        <path
          d="M15.924 345.043C52.095 442.527 145.93 512 256.001 512C366.072 512 459.907 442.527 496.078 345.043H15.924Z"
          fill="#D80027"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_5784">
          <rect width="512" height="512" fill="white" transform="translate(0.000976562)" />
        </clipPath>
      </defs>
    </svg>
  ),

  unitedStatesFlag: ({ ...props }: LucideProps) => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_2_6053)">
        <path
          d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
          fill="#F0F0F0"
        />
        <path d="M244.87 256.001H512C512 232.895 508.92 210.511 503.181 189.218H244.87V256.001Z" fill="#D80027" />
        <path
          d="M244.87 122.435H474.426C458.755 96.8633 438.718 74.2603 415.356 55.6523H244.87V122.435Z"
          fill="#D80027"
        />
        <path
          d="M256 512.001C316.249 512.001 371.626 491.177 415.356 456.349H96.644C140.374 491.177 195.751 512.001 256 512.001Z"
          fill="#D80027"
        />
        <path
          d="M37.5738 389.565H474.426C487.007 369.036 496.764 346.596 503.181 322.782H8.81885C15.2358 346.596 24.9928 369.036 37.5738 389.565Z"
          fill="#D80027"
        />
        <path
          d="M118.584 39.978H141.913L120.213 55.743L128.502 81.252L106.803 65.487L85.104 81.252L92.264 59.215C73.158 75.13 56.412 93.776 42.612 114.552H50.087L36.274 124.587C34.122 128.177 32.058 131.824 30.08 135.525L36.676 155.826L24.37 146.885C21.311 153.366 18.513 159.993 15.998 166.758L23.265 189.126H50.087L28.387 204.891L36.676 230.4L14.977 214.635L1.979 224.079C0.678 234.537 0 245.189 0 256H256C256 114.616 256 97.948 256 0C205.428 0 158.285 14.67 118.584 39.978ZM128.502 230.4L106.803 214.635L85.104 230.4L93.393 204.891L71.693 189.126H98.515L106.803 163.617L115.091 189.126H141.913L120.213 204.891L128.502 230.4ZM120.213 130.317L128.502 155.826L106.803 140.061L85.104 155.826L93.393 130.317L71.693 114.552H98.515L106.803 89.043L115.091 114.552H141.913L120.213 130.317ZM220.328 230.4L198.629 214.635L176.93 230.4L185.219 204.891L163.519 189.126H190.341L198.629 163.617L206.917 189.126H233.739L212.039 204.891L220.328 230.4ZM212.039 130.317L220.328 155.826L198.629 140.061L176.93 155.826L185.219 130.317L163.519 114.552H190.341L198.629 89.043L206.917 114.552H233.739L212.039 130.317ZM212.039 55.743L220.328 81.252L198.629 65.487L176.93 81.252L185.219 55.743L163.519 39.978H190.341L198.629 14.469L206.917 39.978H233.739L212.039 55.743Z"
          fill="#0052B4"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_6053">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),

  waypoints: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="m10.2 6.3-3.9 3.9" />
      <circle cx="4.5" cy="12" r="2.5" />
      <path d="M7 12h10" />
      <circle cx="19.5" cy="12" r="2.5" />
      <path d="m13.8 17.7 3.9-3.9" />
      <circle cx="12" cy="19.5" r="2.5" />
    </svg>
  ),
}
