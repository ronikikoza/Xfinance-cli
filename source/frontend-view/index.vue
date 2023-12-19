<template>
	<search-page-container :search-page-name="searchPageName" />
</template>

<script>
import { Page } from '../../../mixins/index.js';

const PAGE_NAME = 'folderName';

export default {
	mixins: [Page(PAGE_NAME)],
	components: {
		'search-page-container': () => import('../../../components/SearchPageContainer.vue')
	},
	data() {
		return { searchPageName: PAGE_NAME };
	}
};
</script>
