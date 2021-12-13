<header class="header" role="banner">
	<nav role="navigation" id="main-nav">
	<div class="grid-container site-header"><div class="grid-x grid-padding-x align-middle">
		<div class="cell small-6 medium-5 large-4">
			<a href="$BaseHref" class="brand" rel="home">
				<h1>$SiteConfig.Title</h1>
			</a>
			<% if $SearchForm %>
				<span class="search-dropdown-icon">L</span>
				<div class="search-bar">
					$SearchForm
				</div>
			<% end_if %>
		</div>
		<div class="cell small-6 medium-7 large-8">
			<% include Navigation %>
		</div>
	</div></div>
	</nav>
</header>

<nav class="mobile-menu vertical menu" id="mobile-menu" role="navigation">
<div class="grid-container full full-height"><div class="grid-x grid-margin-x full-height">
	<div class="cell small-12 top-30 text-right ">
		<a href="javascript:void(0)" class="closebtn" ></a>
	</div>
	<div class="cell small-12">
		<div class="grid-container full"><div class="grid-x grid-margin-x">

			<div class="cell small-12 medium-10">
				<ol id="menu-main-menu" class="vertical menu" data-accordion-menu="" data-submenu-toggle="true" role="tree" aria-multiselectable="true" data-e="hrtnmf-e">
					<% loop $Menu(1) %>
						<li class="$LinkingMode"><a href="$Link" title="$Title.XML">$MenuTitle.XML</a></li>
					<% end_loop %>
				</ol>
			</div>
		</div></div>
	</div>

</div></div>
</nav>
