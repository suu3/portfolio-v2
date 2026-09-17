"use client";

import dynamic from "next/dynamic";

/** the 3D stage never renders on the server */
const CharacterStage = dynamic(() => import("./index"), { ssr: false });

export default CharacterStage;
