'use client';

import React from 'react';
import { Activity, Shield, Zap, Network } from 'lucide-react';
import { DataBarItem } from './UIElements';

export default function DataBar() {
  return (
    <section className="py-32 border-y border-white/5 bg-surface relative z-10">
      <div className="container-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <DataBarItem icon={<Activity size={20} />} label="Global Nodes" value="482" />
          <DataBarItem icon={<Shield size={20} />} label="Security Rating" value="A++" />
          <DataBarItem icon={<Zap size={20} />} label="Uptime Verified" value="99.999%" />
          <DataBarItem icon={<Network size={20} />} label="Mesh Latency" value="0.4ms" />
        </div>
      </div>
    </section>
  );
}
