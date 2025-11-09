'use client';

import { FavoriteProjectsProvider } from '@/contexts/FavoriteProjectsContext';
import { ProgressProvider } from '@bprogress/next/app';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <FavoriteProjectsProvider>

            <ProgressProvider
                height="2px"
                color="#0070f3"
                options={{ showSpinner: false }}
                shallowRouting

            >
                {children}
            </ProgressProvider>
        </FavoriteProjectsProvider>
    );
};

export default Providers;