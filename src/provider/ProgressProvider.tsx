'use client';
import React from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Next13ProgressBar height="4px" color="#1B2329" options={{ showSpinner: true }} showOnShallow />
            {children}
        </>
    );
};

export default Providers;