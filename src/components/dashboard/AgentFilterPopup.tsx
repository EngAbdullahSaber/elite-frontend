'use client'
import { useState } from 'react';
import Popup from '../shared/Popup';
import InfoCell from '../shared/InfoCell';
import { MdClose } from 'react-icons/md';
import UserFilterContent from './UserFilterContent';
import { agents } from '@/constants/dashboard/admin/appointment/contants';

type Agent = {
    id: number;
    name: string;
    email: string;
    image?: string;
};

type Props = {
    selectedAgent?: Agent;
    onSelect: (agent: Agent) => void;
    onClear: () => void;
    buttonLabel?: string;
    buttonClassName?: string;
};

export default function AgentFilterPopup({
    selectedAgent,
    onSelect,
    onClear,
    buttonLabel = 'تصفية حسب الوسيط',
    buttonClassName = '',
}: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            {!selectedAgent ? (
                <button
                    onClick={() => setShow(true)}
                    className={`w-full md:w-fit py-3 px-8 border font-semibold rounded-full hover:bg-gray-200 transition-colors ${buttonClassName}`}
                >
                    {buttonLabel}
                </button>
            ) : (
                <div className="flex items-center gap-2 border p-1 rounded-full bg-white">
                    <InfoCell
                        image={selectedAgent.image}
                        subtitle={selectedAgent.email}
                        title={selectedAgent.name}
                        imageRounded="full"
                    />
                    <button
                        onClick={onClear}
                        className="text-gray-500 hover:text-red-500 p-2 rounded-full"
                    >
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>
            )}

            <Popup show={show} onClose={() => setShow(false)}>
                <UserFilterContent
                    onSelect={(agent) => {
                        onSelect(agent);
                        setShow(false);
                    }}
                    users={agents}
                    label='وسيط'
                />
            </Popup>
        </div>
    );
}
