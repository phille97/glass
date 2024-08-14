import { useEffect, useState } from "react";

import { usePocket } from "../contexts/PocketContext";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const navigate = useNavigate();
  const { user, pb, logout } = usePocket();

  // List
  const [counters, setCounters] = useState<any>({ items: [] });
  const refresh = async () => {
	setCounters(await pb.collection('counters').getList(1, 50, {
		filter: 'owners.id ?= "' + user.id + '"'
	}));
  }
  useEffect(() => {
	refresh();
  }, [])

  // Create
  const [newCounterName, setNewCounterName] = useState('');
  const create = async () => {
	await pb.collection('counters').create({
		"name": newCounterName,
		"owners": [
			user.id,
		],
		"public": true,
		"count": 0
	})
	await refresh();
  }

  // Edit
  const patch = async (id: string, patch: any) => {
	const newRecord = await pb.collection('counters').update(id, patch);
	setCounters({
		items: counters.items.map((item: any) => {
			if (item.id == id) {
				return newRecord;
			}
			return item;
		})
	});
  }

  // Delete
  const deleteCounter = async (id: string) => {
	await pb.collection('counters').delete(id);
	await refresh();
  }

  const publicLink = (id: string) => {
	return `https://insaneo.se/#/c/${id}`
  }

  if(!user) {
	return <p>Please login first</p>
  }

  return (
    <section>
      <ul style={{
	paddingLeft: 0,
      }}>
	{counters.items.map((item: any) => <li key={item.id} style={{
		listStyle: 'none',
		border: '1px black solid',
		padding: '1em',
	}}>
		<h2 style={{fontWeight: 'bold'}}>{item.name}</h2>
		<button onClick={() => {
			patch(item.id, { count: item.count - 1 });
		}}>-</button> { item.count } <button onClick={() => {
			patch(item.id, { count: item.count + 1 });
		}}>+</button><br /><br />
		{item.public ? <>
		<a href={publicLink(item.id)}>{publicLink(item.id)}</a><br />
		<button onClick={() => {
			patch(item.id, { public: false });
		}}>Make private</button>
		</> : <>
		<button onClick={() => {
			patch(item.id, { public: true });
		}}>Make public</button>
		</>}
		<br />
		<br />
		<button onClick={() => {
			if (!confirm('Are you sure?')) {
				return;
			}
			deleteCounter(item.id);
		}}>Delete</button><br />
	</li>)}
	{counters.items === 0 ?? <>
		<p>You don't have any counters yet. Add one using the form below</p>
	</>}
      </ul>
      <div>
	<p>Add a new counter</p>
	<input type="text" placeholder="Name" value={newCounterName} onChange={(event: any) => {
		setNewCounterName(event.target.value);
	}} />
	<button onClick={() => {
		create();
	}}>Create</button>
      </div>
      <button onClick={() => {
	logout();
	navigate('/')
      }}>Logout</button>
    </section>
  );
};