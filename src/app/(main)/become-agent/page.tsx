
import BecomeAgentForm from '@/components/main/becomeAgent/BecomeAgentForm';
import CenteredContainer from '@/components/shared/CenteredContainer';
import LightPageHeader from '@/components/shared/LightPageHeader';


export default function BecomeAgentPage() {

    return (
        <CenteredContainer>
            <LightPageHeader text='ابدأ رحلتك معنا كوسيط عقاري' />
            <BecomeAgentForm />
        </CenteredContainer>
    );
}


