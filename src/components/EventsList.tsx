import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  loading: boolean;
  isSuccess: boolean;
  events: Event[] | null;
};

interface Event {
  id: string;
  title: string;
  description: string;
}

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function EventsList({ loading, isSuccess, events }: Props) {
  return (
    <div className="p-4">
      {loading ? (
        <>
          <SkeletonDemo />
          <div className="my-4" />
          <SkeletonDemo />
        </>
      ) : isSuccess && events !== null ? (
        events.map((event) => {
          return <EventsListItem key={event.id} event={event} />;
        })
      ) : (
        "No events found"
      )}
    </div>
  );
}

function EventsListItem({ event }: { event: Event }) {
  return (
    <>
      <Item variant="outline" className="mb-4">
        <ItemContent>
          <ItemTitle>{event.title}</ItemTitle>
          <ItemDescription>{event.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log(`Event ID: ${event.id}`)}
          >
            Action
          </Button>
        </ItemActions>
      </Item>
    </>
  );
}

export default EventsList;
