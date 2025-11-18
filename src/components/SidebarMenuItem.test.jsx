/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarMenuItem from './SidebarMenuItem.jsx';

describe('SidebarMenuItem', () => {
  it('renders label, img and link when src and to provided', () => {
    render(
      <MemoryRouter>
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Dashboard" to="/dashboard" />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByAltText(/Dashboard icon/i)).toHaveAttribute('src', '/assets/icon/dashboard.svg');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
