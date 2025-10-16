import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import type { EventItem } from "@/types";

type Props = {
  loading: boolean;
  isSuccess: boolean;
  events: EventItem[];
};

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
  console.log("EventsList - ", { loading, isSuccess, events });
  return (
    <div className="p-4">
      {loading ? (
        <>
          <SkeletonDemo />
          <div className="my-4" />
          <SkeletonDemo />
        </>
      ) : isSuccess && events.length > 0 ? (
        events.map((item: EventItem) => {
          return <EventsListItem key={item.id} itemData={item} />;
        })
      ) : (
        "No events found"
      )}
    </div>
  );
}

function EventsListItem({ itemData }: { itemData: EventItem }) {
  return (
    <>
      <Item variant="outline" className="mb-4">
        <ItemContent>
          <ItemTitle>{itemData.title}</ItemTitle>
          <ItemDescription>{itemData.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log(`Event ID: ${itemData.id}`)}
          >
            Action
          </Button>
        </ItemActions>
      </Item>
    </>
  );
}

export default EventsList;
