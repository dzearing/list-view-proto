# ODSP FilesView React components


## Flow of reading items

The FilesView is rendered and dispatches the OPEN_ITEM_SET action with no specific item set context.

Middleware intercepts the action and opens a DataSourceManager subscription.

## Actions

### OPEN_ITEM_SET

OPEN_ITEM_SET is handled by the middleware data source manager singleton. The data source manager provides subscriptions for item sets, which can communicates hosts a singleton instance which tracks the callbacks.

2. INVALIDATE_ITEM_SET

3. CLOSE_ITEM_SET

### ITEMS_AVAILABLE

### ERROR_LOADING_ITEMS

## Adding commands

Commands are split into read vs write commands to optimize for bundle size.

Read commands include:

OPEN_ITEM_SET


By default, commands consist of operations that manipulate the reading state of the FielsView:


 of only the most mi

The manager determines which datasource is appropriate for the given set (or uses the default.)

The manager asks the data source is asked to get the set.

The data source makes an XHR request. When it succeeds, the

## Configuration

## Item normalization and formatting

In order for data sources to be rendered in a generic way, items must be normalized into a format which can be handled in a generic way.

Normalization allows us to perform the following actions genericly:

1. Determine which actions are available.
2. Render fields in a predictable way.

All items must have unique `id` attributes, which should not conflict with any other item.

