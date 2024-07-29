'use client';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import InstantCallForm from './InstantCallForm';

const InstantCall = ({ skills, mongoUserId }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                title="Instant Call">
                <InstantCallForm skills={skills} mongoUserId={mongoUserId} />
            </Modal>

            <Button
                className="green-gradient min-h-[46px] px-4 py-3 !text-light-900"
                onClick={() => {
                    setIsModalOpen(true);
                }}>
                Instant Call
            </Button>
        </>
    );
};

export default InstantCall;
