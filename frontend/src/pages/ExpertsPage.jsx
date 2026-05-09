import { useState, useEffect, useDeferredValue } from 'react';
import { motion } from 'framer-motion';
import { getExperts, getCategories } from '../api/services';
import ExpertCard from '../components/ExpertCard';
import ExpertCardSkeleton from '../components/ExpertCardSkeleton';
import Pagination from '../components/Pagination';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import { CalendarIcon, FilterIcon, GridIcon, SearchIcon, SparklesIcon } from '../components/Icons';
import { fadeUp, staggerContainer } from '../utils/motion';

export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [categories, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategoriesList(data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchExperts = async () => {
      try {
        const { data } = await getExperts({
          page: currentPage,
          search: deferredSearch,
          category,
        });

        if (ignore) {
          return;
        }

        setExperts(data.experts);
        setTotalPages(data.totalPages);
        setTotalExperts(data.total);
        setError(null);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to fetch experts');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchExperts();

    return () => {
      ignore = true;
    };
  }, [category, currentPage, deferredSearch, retryCount]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
    setRefreshing(true);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
    setRefreshing(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setRefreshing(true);
  };

  const handleRetry = () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);
    setRetryCount((count) => count + 1);
  };

  const showLoadingState = loading || refreshing;
  const activeCategoryLabel = category || 'All categories';

  return (
    <PageShell>
      <motion.section variants={fadeUp} className="premium-panel px-6 py-7 sm:px-8 sm:py-9">
        <SectionHeader
          eyebrow="Curated expert marketplace"
          title="Book faster with advisors who feel ready before you even click."
          description="Browse premium experts across business, product, design, health, finance, and technology with real-time availability synced across every session."
          aside={(
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="metric-tile">
                <span className="metric-label">Experts in network</span>
                <p className="metric-value">{totalExperts}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label">Active categories</span>
                <p className="metric-value">{categories.length}</p>
              </div>
              <div className="metric-tile">
                <span className="metric-label">Availability sync</span>
                <p className="metric-value text-base">Real-time</p>
              </div>
            </div>
          )}
        />
      </motion.section>

      <motion.section variants={fadeUp} className="premium-panel px-5 py-5 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_auto]">
          <label className="relative block">
            <span className="field-label">Search by expert name</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-[3.35rem] h-5 w-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search product strategists, health coaches, founders..."
              value={search}
              onChange={handleSearchChange}
              className="input-shell h-14 pl-12 pr-4"
            />
          </label>

          <label className="relative block">
            <span className="field-label">Filter by category</span>
            <FilterIcon className="pointer-events-none absolute left-4 top-[3.35rem] h-5 w-5 text-[var(--color-text-muted)]" />
            <select
              value={category}
              onChange={handleCategoryChange}
              className="select-shell h-14 appearance-none pl-12 pr-4"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <div className="flex w-full flex-wrap gap-2 lg:justify-end">
              <span className="surface-chip">
                <GridIcon className="h-4 w-4" />
                {totalExperts} matched
              </span>
              <span className="surface-chip">
                <CalendarIcon className="h-4 w-4" />
                {activeCategoryLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="surface-chip">
            <span className="live-dot" />
            Live booking state
          </span>
          <span className="surface-chip">
            <SparklesIcon className="h-4 w-4" />
            SaaS-grade browsing experience
          </span>
        </div>
      </motion.section>

      {error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : showLoadingState ? (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ExpertCardSkeleton key={index} />
          ))}
        </motion.section>
      ) : experts.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" />}
          title="No experts match this search"
          message="Try a broader name query, switch categories, or clear the filter to reopen the full roster."
        />
      ) : (
        <>
          <motion.section variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                Available experts
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Page {currentPage} with {experts.length} expert profiles ready to book.
              </p>
            </div>
            <div className="surface-chip">
              <SparklesIcon className="h-4 w-4" />
              Results update as you refine filters
            </div>
          </motion.section>

          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </motion.section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </PageShell>
  );
}
