'use client';

import React from 'react';
import { TimelineItem } from './UIElements';

export default function Timeline() {
  return (
    <section className="py-60 bg-[#020202] relative">
      <div className="container-7xl grid-12">
        <div className="span-4">
          <span className="text-technical text-emerald mb-10 block">Lifecycle</span>
          <h2 className="text-5xl md:text-7xl text-white tracking-tighter sticky top-40">The<br />Protocol<br />Cycle.</h2>
        </div>
        <div className="span-8 space-y-40">
          <TimelineItem
            num="01"
            title="Synthesis"
            desc="Analysis of the digital ecosystem requirements to determine the optimal node distribution and resource allocation."
          />
          <TimelineItem
            num="02"
            title="Execution"
            desc="Deploying custom hardware-accelerated code clusters across our self-healing globally distributed network."
          />
          <TimelineItem
            num="03"
            title="Stabilization"
            desc="Continuous real-time optimization using AI-driven telemetry to maintain peak performance and absolute security."
          />
        </div>
      </div>
    </section>
  );
}
