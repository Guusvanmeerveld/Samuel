export interface Set {
	artwork_url: string;
	created_at: Date;
	description: string;
	duration: number;
	embeddable_by: string;
	genre: string;
	id: number;
	kind: string;
	label_name: string;
	last_modified: Date;
	license: string;
	likes_count: number;
	managed_by_feeds: boolean;
	permalink: string;
	permalink_url: string;
	public: boolean;
	purchase_title: string;
	purchase_url: string;
	release_date: Date;
	reposts_count: number;
	secret_token: null;
	sharing: string;
	tag_list: string;
	title: string;
	uri: string;
	user_id: number;
	set_type: string;
	is_album: boolean;
	published_at: Date;
	display_date: Date;
	user: User;
	tracks: Track[];
	track_count: number;
}

interface Transcoding {
	url: string;
	preset: string;
	duration: number;
	snipped: boolean;
	format: { protocol: string; mime_type: string };
	quality: string;
}

interface PublisherMetadata {
	id: number;
	urn: string;
	artist: string;
	album_title: string;
	contains_music: boolean;
	upc_or_ean: string;
	isrc: string;
	explicit: boolean;
	p_line: string;
	p_line_for_display: string;
	c_line: string;
	c_line_for_display: string;
	release_title: string;
}

interface User {
	avatar_url: string;
	city: string;
	comments_count: number;
	country_code: null;
	created_at: string;
	creator_subscriptions: Array<null[]>;
	creator_subscription: CreatorSubscription;
	description: string;
	followers_count: number;
	followings_count: number;
	first_name: string;
	full_name: string;
	groups_count: number;
	id: number;
	kind: string;
	last_modified: string;
	last_name: string;
	likes_count: number;
	playlist_likes_count: number;
	permalink: string;
	permalink_url: string;
	playlist_count: number;
	reposts_count: null;
	track_count: number;
	uri: string;
	urn: string;
	username: string;
	verified: boolean;
	visuals: Visuals;
	badges: Badges;
}

interface CreatorSubscription {
	product: null[];
}

interface Visuals {
	urn: string;
	enabled: boolean;
	visuals: null[];
	tracking: null;
}

export interface SearchResult {
	collection: Track[];
	total_results: number;
	next_href: string;
	query_urn: string;
}

export interface Track {
	artwork_url: null | string;
	caption: null;
	commentable: boolean;
	comment_count: number;
	created_at: string;
	description: string;
	downloadable: boolean;
	download_count: number;
	duration: number;
	full_duration: number;
	embeddable_by: EmbeddableBy;
	genre: string;
	has_downloads_left: boolean;
	id: number;
	kind: CollectionKind;
	label_name: null | string;
	last_modified: string;
	license: License;
	likes_count: number;
	permalink: string;
	permalink_url: string;
	playback_count: number;
	public: boolean;
	publisher_metadata: PublisherMetadata | null;
	purchase_title: null;
	purchase_url: null;
	release_date: null;
	reposts_count: number;
	secret_token: null;
	sharing: Sharing;
	state: State;
	streamable: boolean;
	tag_list: string;
	title: string;
	track_format: TrackFormat;
	uri: string;
	urn: string;
	user_id: number;
	visuals: null;
	waveform_url: string;
	display_date: string;
	media: Media;
	monetization_model: MonetizationModel;
	policy: Policy;
	user: User;
}

enum EmbeddableBy {
	All = 'all',
}

enum CollectionKind {
	Track = 'track',
}

enum License {
	AllRightsReserved = 'all-rights-reserved',
}

interface Media {
	transcodings: Transcoding[];
}

enum MonetizationModel {
	Blackbox = 'BLACKBOX',
	NotApplicable = 'NOT_APPLICABLE',
}

enum Policy {
	Allow = 'ALLOW',
	Monetize = 'MONETIZE',
}

enum Sharing {
	Public = 'public',
}

enum State {
	Finished = 'finished',
}

enum TrackFormat {
	SingleTrack = 'single-track',
}

interface Badges {
	pro: boolean;
	pro_unlimited: boolean;
	verified: boolean;
}
