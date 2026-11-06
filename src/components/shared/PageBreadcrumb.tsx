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
    <Breadcrumb className="py-2.5">
      <BreadcrumbList>
        {trail.map((crumb) => (
          <Fragment key={crumb.to}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link className="inline-flex min-h-8 items-center" to={crumb.to}>
                  {crumb.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default PageBreadcrumb
