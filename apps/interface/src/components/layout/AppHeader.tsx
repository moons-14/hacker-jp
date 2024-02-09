import { Github, Twitter } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";

export const AppHeader = () => {
  return (
    <div className="flex items-center h-16">
      <div className="text-lg font-bold">Hacker News JP</div>
      <div className="flex-1 flex justify-end gap-6">
        <div>
          <a href="https://github.com/moons-14/hacker-jp" target="_blank" rel="noreferrer">
            <Github />
          </a>
        </div>
        <div>
          <a href="https://twitter.com/moons_dev" target="_blank" rel="noreferrer">
            <Twitter />
          </a>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
