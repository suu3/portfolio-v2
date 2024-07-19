"use client";

import { useState } from "react";
import Burger from "./burger";
import Stairs from "./stairs";
import Menu from "./menu";
import { AnimatePresence, LayoutGroup } from "framer-motion";

export default function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <header>
      <Burger
        openMenu={() => {
          setMenuIsOpen(true);
        }}
      />
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {menuIsOpen && (
            <>
              <Stairs key="stairs" />
              <Menu
                closeMenu={() => {
                  setMenuIsOpen(false);
                }}
              />
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </header>
  );
}
