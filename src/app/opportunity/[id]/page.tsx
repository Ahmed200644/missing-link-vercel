import { OpportunityDetail } from './OpportunityDetail';

export default function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <OpportunityDetail id={params.id} />;
}
