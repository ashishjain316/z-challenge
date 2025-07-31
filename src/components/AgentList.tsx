import { useState, useEffect, useMemo, useCallback } from 'react';

const STATUS = {
	all:{
  		label: 'All',
  		color: 'bg-gray-500',
		priority: -1
	}, 
	online: {
  		label: 'Online',
  		color: 'bg-green-500',
		priority: 0
	}, 
	busy: {
  		label: 'Busy',
  		color: 'bg-yellow-500',
		priority: 1
	}, 
	away: {
  		label: 'Away',
  		color: 'bg-orange-500',
		priority: 2
	}, 
	offline: {
  		label: 'Offline',
  		color: 'bg-gray-500',
		priority: 3
	}
}

type Agent = {
  first_name: string;
  last_name: string;
  status: keyof typeof STATUS;
  profile: string;
  avatar: string;
}
type DataResponse = {
  agents: Agent[];
}

const AgentCard = ({ agent }: { agent: Agent }) =>  (
	<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
	  {/* Agent Avatar */}
	  <div className="relative">
		<img
			src={agent.avatar}
			alt={`Avatar - ${agent.first_name} ${agent.last_name}`}
			className="w-full h-48 object-cover"
			loading="lazy"
		/>
	  </div>

	  {/* Agent Info */}
	  <div className="p-4">
		<div className="flex items-center justify-between mb-2">
			<h3 className="text-lg font-semibold text-gray-900">
				{agent.first_name} {agent.last_name}
			</h3>
			<span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS[agent.status].color} text-white`}>
				{STATUS[agent.status].label}
			</span>
		</div>						
		<div className="flex items-center text-sm text-gray-600">
			<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
				{agent.profile}
			</span>
		</div>
	  </div>
	</div>
);

const FilterControls = ({ 
	statusFilter, 
	onStatusChange, 
	filteredCount, 
  	totalCount 
}: {
	statusFilter: keyof typeof STATUS;
	onStatusChange: (value: keyof typeof STATUS) => void;
	filteredCount: number;
	totalCount: number;
}) => {
	
	const statusOptions = useMemo(() => 
		Object.keys(STATUS).map((value) => ({
			value,
			label: STATUS[value as keyof typeof STATUS].label
		})), []
  	);

  return (
	<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
	  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
		<div className="mb-4 sm:mb-0">
		  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
			Filter by Status:
		  </label>
		  <select
			id="status-filter"
			value={statusFilter}
			onChange={(e) => onStatusChange(e.target.value as keyof typeof STATUS)}
			className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
		  >
			{statusOptions.map(({ value, label }) => (
			  <option key={value} value={value}>
				{label}
			  </option>
			))}
		  </select>
		</div>
		<div className="text-sm text-gray-600">
		  Showing {filteredCount} of {totalCount} agents
		</div>
	  </div>
	</div>
  );
};

const AgentList = () => {
	const [agents, setAgents] = useState<Agent[]>([]);
	const [statusFilter, setStatusFilter] = useState<keyof typeof STATUS>('all');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAgents = useCallback(async () => {
		try {
		setError(null);
		setLoading(true);
		const response = await fetch('https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data: DataResponse = await response.json();
		setAgents(data.agents);
		} catch (error) {
		setError(error instanceof Error ? error.message : 'Failed to fetch agents');
		} finally {
		setLoading(false);
		}
	}, []);

	const filteredAgents = useMemo(() => {
		let filtered = agents;
		
		// Filter agents based on status priority
		if (statusFilter !== 'all') {
			filtered = agents.filter(agent => agent.status === statusFilter);
		}
		
		// Sort by status priority then by first name
		return [...filtered].sort((a, b) => {
			const statusDiff = STATUS[a.status].priority - STATUS[b.status].priority;
			if (statusDiff !== 0) {
				return statusDiff;
			}
			return a.first_name.localeCompare(b.first_name);
		});
	}, [agents, statusFilter]);

	
	const handleStatusChange = useCallback((value: keyof typeof STATUS) => {
			setStatusFilter(value);
	}, []);

	useEffect(() => {
		fetchAgents();
	}, [fetchAgents]);

	
	if (error) {
		return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				<strong className="font-bold">Error: </strong>
				<span className="block sm:inline">{error}</span>
			</div>
		</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Contact Center Agents
					</h1>
				</div>

				{/* Filter Controls */}
				<FilterControls
					statusFilter={statusFilter}
					onStatusChange={handleStatusChange}
					filteredCount={filteredAgents.length}
					totalCount={agents.length}
				/>

				{/* Loader or Agent Grid */}
				{loading ? (
					<div className="flex justify-center items-center min-h-[232px]">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredAgents.map((agent, index) => (
							<AgentCard key={`${agent.first_name}-${agent.last_name}-${index}`} agent={agent} />
						))}
					</div>
				)}

				{/* Empty State */}
				{filteredAgents.length === 0 && !loading && (
					<div className="text-center py-12">
						<div className="text-gray-400 text-6xl mb-4">👥</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
						<p className="text-gray-600">
						{statusFilter !== 'all' 
							? `No agents are currently ${statusFilter}.`
							: 'No agents available at the moment.'
						}
						</p>
					</div>
				)}
			</div>
		</div>
  	);
};

export default AgentList; 