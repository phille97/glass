import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";
import { AnimatedCounter } from  'react-animated-counter';


export const Counter = () => {
  const { itemId } = useParams();
  const { pb } = usePocket();

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState<any>(null);

  if (!itemId) {
	throw new Error('blah');
  }

  const refresh = async () => {
	try {
		const record = await pb.collection('counters').getOne(itemId);
		setCounter(record);
	} catch (e) {}
	setLoading(false);
  };

  useEffect(() => {
	pb.collection('counters').subscribe(itemId, (e) => {
		if (e.action == 'update') {
			setCounter(e.record);
		} else if (e.action == 'delete') {
			setCounter(null);
		} else {
			console.log(e.action);
			console.log(e.record);
		}
	}, {});
	refresh();
	return () => {
		pb.collection('counters').unsubscribe(itemId);
	}
  }, [itemId]);

  if (loading) {
	return <h2>Loading...</h2>
  }

  if (!counter) {
	return <h2>404: Counter Not Found</h2>
  }

  return (
    <section>
      <h2>{counter.name}</h2>
      <AnimatedCounter
      	value={counter.count}
	color="var(--insaneo)"
	fontSize="100px"
	includeDecimals={false}
	/>
    </section>
  );
};