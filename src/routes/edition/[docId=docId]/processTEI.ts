// Credits: https://github.com/raffazizzi/astro-tei/blob/0f3335b6f71cb63c239a06f794f2918e75371ff1/packages/core/src/processTei.ts

import CETEI from "CETEIcean";
import { JSDOM } from 'jsdom';

export interface ProcessedTEI {
//   dom: Document;
//   ceteicean: typeof CETEI;
  serialized: string;
  elements: string[];
}

const processTEI = (data: string): ProcessedTei => {
  const jdom = new JSDOM(data, { contentType: "text/xml" });
  const teiDoc = jdom.window.document;

  const ceteicean = new CETEI({
    documentObject: teiDoc,
  });

  const teiData = ceteicean.preprocess(teiDoc);
  teiData.firstElementChild.setAttribute("data-elements", Array.from(ceteicean.els).join(","));

  // Replace input JSDOM tree with new tree so that we can use the JSDOM native serialize method.
  teiDoc.documentElement.replaceWith(teiData);
    
  return {
    // dom: teiDoc,
    // ceteicean,
    serialized: jdom.serialize(),
    elements: Array.from(ceteicean.els) as string[]
  };
};

export { processTEI as default, processTEI };