# ODSP FilesView React components

## Usage

Using the FilesView is as simple as 2 steps:

### Basic configuration

In your application, you must first register the data sources and applicable contracts:

```tsx
import {
  OneDriveDataSource,
  SharePointDataSource,
  dataSourceManager,
} from '@ms/files-view';

dataSourceManager.addDataSource([
  oneDriveDataSource,
  sharePointDataSource
]);
```


```tsx
render() {
  return (
    <FilesScope>
      <div>
        <FilesCommandBar />
      <div>
      <FilesBreadcrumb />
      <FilesView />
    </FilesScope>
  );
```


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

```tsx
import {
  OneDriveDataSource,
  RedditDataSource,
  dataSourceManager
} from '@ms/files-view';

dataSourceManager.addDataSource('reddit', RedditDataSource);
dataSourceManager.addDataSource(
  'onedrive',
  () => import('@ms/files-view/OneDriveDataSource'),
   {
    options
  });

```

## Item normalization and formatting

In order for data sources to be rendered in a generic way, items must be normalized into a format which can be handled in a generic way.

Normalization allows us to perform the following actions genericly:

1. Determine which actions are available.
2. Render fields in a predictable way.

All items must have unique `id` attributes, which should not conflict with any other item.

# Commanding

## New item (folder or 1 of N file types)

## Upload item or folder

## Rename

## Delete

## Share

## Download

## OpenItem

## ChangeView

## ShowInfoPane


# Design todos

* Sorting and filtering (Modifying an existing view)
* Switching views
* Async commanding (split bundle
)
# Work item todos

### FileTypeIcon support

Need an easy way to render our drive icons for the various item types that works for any data source item.

```tsx
<DriveItemIcon type={ 'folder' | 'docx' | 'txt' | 'default' }>
```

We expose a helper that takes extension and normalizes it into one of the available types.

```tsx
<DriveItemIcon type={ iconTypeFromExtension('woff') }>
```

### Localized string support

We need a way to consume the picker given a language and have the strings show up correctly. If partners need to provide customized content, they would need to pass in the strings as part of the contract.

# Open issues

How does a given set know what columns to render?

Where do we provide localized strings for columns? Are these proprietary per data source? ( Perhaps. )

How do we configure a column to be sortable? Filterable? Groupable?

How does the host get notifications when

# Roadmap

## Oct-Nov 1 - infrastructure work

Est extra devs needed: 0

Repo details ironed out
  Bundle sizes are locked down in CI
Strings can be loaded on demand
Commands can be loaded on demand
Mock data sources with interfaces defined and documented
Data source items cache for fast responses
  Immutable item sets
Item normalization helpers to allow for us to render item data consistently

Demoable breadcrumb navigation and commandbar command filtering
Demoable prototype of data source using Graph apis
Demoable customizations for:
  Custom data source (reddit)
  Custom commands (pin ?)
Demoable side by side data sets (update one, see it in the other)
Demoable changing views to tiles view

## Nov-Jan 1 - majority of work to get to webpart parity

Est extra devs needed: 2

File type icons in Fabric
SharePoint data source using stream apis
Field renderers port
Actions ported
  New
  Upload
  Share
  Delete
  Rename
  Download
  Open
Sorting/filter/grouping support
Empty folder ui
Error ui - port standard localized messages and utilities for translating errors
Telemetry pipeline
Flighting
Operations progress manager

## Jan-Feb 1 - shipping the webpart on the new core

Est extra devs needed: 2

Ramp webpart onto new platform to msit/prod
Stabilize webpart
All webpart code now working on the new platform

## Feb-March 1 - porting more from odsp next over in prep to replace odsp-next

Est extra devs needed: 2

Item viewer? Do we want to include this in what partners can use?
Data set fetching for complex scenarios (large file sets)
Investigate knockout port of remaining actions
Cycle back with OWA and Teams on usage

Once we have momentum, surge:
Rebuild React only app host

Excite the devs!

## March-May 1 - replace odsp-next splist app with fully React stack
