import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type Crumb = { label: string; to: string }

/** Breadcrumb trail at the top of a detail page, ending with the current page's name. */
function PageBreadcrumb({ trail, current }: { trail: Crumb[]; current: string }) {
  return (
    <Breadcrumb className="py-2.5 font-mono [&_ol]:text-[13px]">
      <BreadcrumbList>
        {trail.map((crumb, index) => (
          <Fragment key={crumb.to}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="inline-flex min-h-11 items-center sm:min-h-8" to={crumb.to}>
                  {crumb.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* On phones the trail stops at the section: the page's own title is right below. */}
            <BreadcrumbSeparator className={index === trail.length - 1 ? 'max-sm:hidden' : undefined} />
          </Fragment>
        ))}
        <BreadcrumbItem className="max-sm:hidden">
          <BreadcrumbPage className="block truncate">{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default PageBreadcrumb
